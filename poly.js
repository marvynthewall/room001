"use strict"

function poly(Tcamera, lightd = [0, 0, 1], outdir, c_r = 255, c_g = 255, c_b = 255){
   this.node = [];
   this.dis = -1;
   this.c_r = c_r;
   this.c_g = c_g;
   this.c_b = c_b;
   this.noshow = 0;
   this.lightd = lightd;
   this.outdir = outdir;
   this.shade = 50;
   this.Tcamera = Tcamera;
}
poly.prototype.render = function(Tcamera){
   this.clip(Tcamera);
   this.caldis(Tcamera);
   if(this.lightd == -1)return;
   this.lighting();
}
poly.prototype.printnode = function(){
   console.log("print node==================================");
   for(var i = 0 ; i < this.node.length ; ++i ){
      console.log(this.node[i])
   }
   console.log("********************************************");
}
poly.prototype.insertnode = function(n){
   this.node.push(n);
}
poly.prototype.insert= function(x, y, z){
   var n = [x, y, z]
   this.node.push(n);
}
poly.prototype.clip = function(Tcamera){
   var transpoint = [];// transform to camera world
   for(var i = 0 ; i < this.node.length ; ++i){
      var tran = twgl.m4.transformPoint(Tcamera, this.node[i]);
      transpoint.push(tran);
      //console.log("tran: "+tran);
   }
   // check if there is any need for clipping
   var clip = 0;
   var z = 0; // z = 0 at first, z = -1 when the point is in normal range, z = 1 when the point coordinate z > 0: need to notice!
   var notice = 0;
   var checkpoint1 = -1;
   var checkpoint2 = -1;
   var r;
   // go through the whole circle and record the checkpoint, move to back and to front
   for(var i = 0 ; i <= this.node.length ; ++i ) { // go a circle
      //console.log("i="+i+", z="+z);
      if(i == this.node.length)r = 0;
      else r=i;
      if( z * transpoint[r][2] < 0){//cross!!
         clip = 1;
         if(transpoint[r][2] >= 0 && checkpoint1 == -1){
            z = 1;
            if(i!=0)checkpoint1 = i-1; // use i for sake of the negative
            else checkpoint1 = this.node.length-1;
            //console.log("checkpoint1:"+checkpoint1);
         }
         else if(transpoint[r][2] < 0 && checkpoint2 == -1){
            z = -1;
            if(i!=0)checkpoint2 = i-1;
            else checkpoint2 = this.node.length-1;
            //console.log("checkpoint2:"+checkpoint2);
         }
         else alert("something goes wrong in clipping!!");
      }
      else if (transpoint[r][2] >= 0){
         //console.log("behind");
         z = 1;
         notice = 1;
      }
      else z = -1;//transpoint[r][2] < 0, normal
   }
   if(clip == 0 && notice == 1){// all behind!! don't draw
      //console.log("all behind!!");
      this.noshow = 1;
   }
   else if(clip == 1){
      //console.log("clipping!!!");
      if(checkpoint1 == -1 || checkpoint2 == -1){
         alert("something wrong in clipping");
      }
      else {// do clipping
         var invtransform = twgl.m4.inverse(Tcamera);

         //checkpoint1
         var second = checkpoint1+1;
         if(second == this.node.length)second = 0;
         var cp1 = this.findclippoint(transpoint[checkpoint1], transpoint[second]);
         var cpo1 = twgl.m4.transformPoint(invtransform, cp1);
         //console.log("cp1: "+cp1+", cpo1:"+cpo1);
         //checkpoint2
         second = checkpoint2+1;
         if(second == this.node.length)second = 0;
         var cp2 = this.findclippoint(transpoint[second], transpoint[checkpoint2]);
         var cpo2 = twgl.m4.transformPoint(invtransform, cp2);
         //console.log("cp2: "+cp2+", cpo2:"+cpo2);
         
         // insert these points
         var num = this.node.length;
         second = checkpoint1+1;
         if(second == num)second = 0;
         this.node.splice(second, 0, cpo1);// insert
         ++num;
         checkpoint1 = second;
         // move checkpoint2
         if(checkpoint2 >= second)++checkpoint2;
         second = checkpoint2+1;
         if(second == num) second = 0;
         this.node.splice(second, 0, cpo2);// insert
         ++num;
         checkpoint2 = second;
         if(checkpoint1 >= second)++checkpoint1;
         //console.log("deleting, cp1:"+checkpoint1+", cp2:"+checkpoint2+", num: "+num);
         
         //this.printnode();
         var newnode = [];
         // delete those points from checkpoint1+1 to checkpoint2
         for(var i = checkpoint2 ; i != checkpoint1+1 ; ++i){
            if(i == num)i = 0;
            newnode.push(this.node[i]);
         }
         this.node = newnode;
      }
   }
   //else is just normal objects
}
poly.prototype.findclippoint = function(n1, n2){
   var c0 = n2[0]-n1[0];
   var c1 = n2[1]-n1[1];
   var c2 = n2[2]-n1[2];
   var alpha = (-1-n1[2])/c2;
   var x = n1[0] + alpha * c0;
   var y = n1[1] + alpha * c1;
   var z = -1;
   var node=[];
   node.push(x);
   node.push(y);
   node.push(z);
   return node;
}
poly.prototype.caldis = function(Tcamera){
   var x = 0, y = 0, z = 0;
   var transpoint = [];// transform to camera world, to calculate the distance
   for(var i = 0 ; i < this.node.length ; ++i){
      var tran = twgl.m4.transformPoint(Tcamera, this.node[i]);
      transpoint.push(tran);
      x += tran[0];
      y += tran[1];
      z += tran[2];
   }
   x /= this.node.length;
   y /= this.node.length;
   z /= this.node.length;
   
   var cen = [x, y, z];
   this.dis = Math.sqrt(x*x+y*y+z*z);
}

poly.prototype.lighting = function(){
   var inner = this.outdir[0] * this.lightd[0] + this.outdir[1] * this.lightd[1] + this.outdir[2] * this.lightd[2];
   var darker = this.shade * (1-inner)/2;
   this.c_r = Math.floor(this.c_r - darker);
   this.c_g = Math.floor(this.c_g - darker);
   this.c_b = Math.floor(this.c_b - darker);
   if(this.c_r < 0) this.c_r = 0;
   if(this.c_g < 0) this.c_g = 0;
   if(this.c_b < 0) this.c_b = 0;
   //console.log(this.c_r+" "+this.c_g+" "+this.c_b);
}
