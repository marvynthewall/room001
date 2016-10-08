"use strict"
function drawworld(canv, cont, m){
   this.canvas = canv;
   this.context = cont;
   this.m4 = m;
   this.shapelist = new shapelist();
   this.angularspeed = 0;
   this.angularsmall = 0;
   this.swangle = 0;  // the tilt angle
   this.angle = 0;   // the angle position of whole    
   this.dangle;
   this.now;
   this.then = Date.now();
   this.elapsed;
   this.slider4 = document.getElementById("slider4");
   this.slider5 = document.getElementById("slider5");
}
drawworld.prototype.renew = function(){
   this.shapelist.clear();
}
drawworld.prototype.drawAll = function(Tcamera, Tpost, lightd){
   // the room
   this.drawroom(Tcamera, Tpost);
   this.drawshapes(Tpost);
   /*
   // just some cube
   var Ttrans = this.m4.translation([0, 250, 0]);
   var Tcom = this.m4.multiply(Ttrans, Tcamera);
   this.addCube(Tcom, lightd, 100, 255, 150);
   */
   // the desk
   this.drawDesk(Tcamera, Tpost, lightd, 90, 50, 15);

   // the swing
   this.drawSwing(Tcamera, Tpost, lightd);
   
   // draw
   this.drawshapes(Tpost);
}
drawworld.prototype.drawSwing = function(Tcamera, Tpost, lightd){
   var axisX = [1, 0, 0];
   var axisY = [0, 1, 0];
   var axisZ = [0, 0, 1];

   
   var eqtall1 = 280;
   var eqtall2 = 80;
   var upperheight = 320;
   var armheight = 300;
   var armlength = 120;
   var wirelength = 150;
   var swirelength = 36;
   var openangle = 0.61;
   
   var bodyr = 219;
   var bodyg = 171;
   var bodyb = 237;
   var liner = 0;
   var lineg = 0;
   var lineb = 0;
   var scube = [[30, 186, 101], [239, 58, 58], [84, 92, 239], [244, 229, 44]];

   // calculate the real speed
   this.angularspeed = this.slider4.value / 100 * Math.PI;
   this.now = Date.now();
   this.elapsed = this.now - this.then;  // in millisecond
   this.then = this.now;
   this.dangle = this.elapsed / 1000 * this.angularspeed;
   this.angle += this.dangle;
   this.angularsmall += this.elapsed / 1000 * this.slider5.value / 100 * Math.PI + this.dangle;
   if(this.angularsmall > 2*Math.PI)this.angularsmall -= 2*Math.PI;
   
   // calculate the swing angle
   this.swangle = Math.PI/2 - cswing(this.angularspeed);

   // start drawing
   var Tdesktop = this.m4.translation([0, 200, 0]);
   var Tnow = this.m4.multiply(Tdesktop, Tcamera); // on the desk up
   var Tmodel = this.m4.axisRotation(axisY, this.angle);
   Tnow = this.m4.multiply(Tmodel, Tnow);
   this.addCube(Tnow, lightd, bodyr, bodyg, bodyb, eqtall1, 40, 40); // light purple
   var Tsecond = this.m4.translation([0, upperheight, 0]);
   var Tsecond = this.m4.multiply(Tsecond, Tnow);
   this.addCube(Tsecond, lightd, bodyr, bodyg, bodyb, eqtall2, 40, 40);
   var Theight = this.m4.translation([0, armheight, 0]);
   Tnow = this.m4.multiply(Theight, Tnow);                 // on the height of arm
   var Trotate = this.m4.axisRotation(axisY, Math.PI/2);
   var ro = this.m4.axisRotation(axisX, Math.PI/2);
   var Toutward = this.m4.translation([0,20,0]);
   var Tout = this.m4.multiply(Toutward, ro);

   function drawArm(world, Tx, ccc){
      world.addCube(Tx, lightd, bodyr, bodyg, bodyb, armlength);
      var Tpack = world.m4.translation([0, armlength, 0]);
      var Ttilt = world.m4.axisRotation(axisX, world.swangle);
      var Tsp = world.m4.axisRotation(axisY, world.angularsmall);
      Tx = world.m4.multiply(Tpack, Tx);
      Tx = world.m4.multiply(Ttilt, Tx);
      Tx = world.m4.multiply(Tsp, Tx);
      drawPackage(world, Tx, ccc);
   }
   function drawPackage(world, Tx, ccc){
      
      //TODO change the line into small plane or thin cube
      world.addCube(Tx, lightd, liner, lineg, lineb, wirelength, 2, 2);
      var Twire1 = world.m4.translation([0, wirelength, 0]);
      var Tweb = world.m4.multiply(Twire1, Tx);
      var Trot = world.m4.axisRotation(axisY, Math.PI/2);
      var Trotnow = world.m4.axisRotation(axisY, Math.PI/4);
      var Topen = world.m4.axisRotation(axisX, openangle);
      
      var Tnnn = world.m4.multiply(Trotnow, Tweb);
      Tnnn = world.m4.multiply(Topen, Tnnn);
      world.addCube(Tnnn, lightd, liner, lineg, lineb, swirelength, 2, 2);


      Trotnow = world.m4.multiply(Trot, Trotnow);
      Tnnn = world.m4.multiply(Trotnow, Tweb);
      Tnnn = world.m4.multiply(Topen, Tnnn);
      world.addCube(Tnnn, lightd, liner, lineg, lineb, swirelength, 2, 2);

      Trotnow = world.m4.multiply(Trot, Trotnow);
      Tnnn = world.m4.multiply(Trotnow, Tweb);
      Tnnn = world.m4.multiply(Topen, Tnnn);
      world.addCube(Tnnn, lightd, liner, lineg, lineb, swirelength, 2, 2);

      Trotnow = world.m4.multiply(Trot, Trotnow);
      Tnnn = world.m4.multiply(Trotnow, Tweb);
      Tnnn = world.m4.multiply(Topen, Tnnn);
      world.addCube(Tnnn, lightd, liner, lineg, lineb, swirelength, 2, 2);

      var Tjump = world.m4.translation([0,wirelength+30,0]);
      var Tfinal = world.m4.multiply(Tjump, Tx);
      world.addCube(Tfinal, lightd, scube[ccc][0], scube[ccc][1], scube[ccc][2], 30, 30, 30);
   }
   var Tarm = this.m4.multiply(Tout, Tnow);
   drawArm(this, Tarm, 0);
   Tnow = this.m4.multiply(Trotate, Tnow);
   Tarm = this.m4.multiply(Tout, Tnow);
   drawArm(this, Tarm, 1);
   Tnow = this.m4.multiply(Trotate, Tnow);
   Tarm = this.m4.multiply(Tout, Tnow);
   drawArm(this, Tarm, 2);
   Tnow = this.m4.multiply(Trotate, Tnow);
   Tarm = this.m4.multiply(Tout, Tnow);
   drawArm(this, Tarm, 3);
   
   function equa(as, r){
      var w = as;
      var g = 2000;
      return (150*(w*w*r)/(Math.sqrt(w*w*w*w*r*r+g*g))+120);
   }
   function cswing(as){
      var tick = 10;
      var s = armlength;
      var e = armlength + wirelength;
      var r = armlength;
      var rr;
      var theta;
      for(;r <= e;r+=tick){
         rr = equa(as, r);
         if(rr-r < 0.1 && r-rr < 0.1)
            break;
         else if(rr > r){// the next round
            s = rr-tick;
            r = s;
            e = rr;
            tick /= 10;
         }
      }
      if(r <= armlength + wirelength && r >= armlength){
         theta = Math.asin((r-armlength) / wirelength);
         return theta;
      }
      else return 0;
      
   }
}
drawworld.prototype.drawshapes = function(Tpost){
   var l = this.shapelist.list.length;
   for(var i = 0 ; i < l ; ++i)
      this.drawpoly(this.shapelist.list[i], this.shapelist.list[i].Tcamera, Tpost);
   this.renew();
}
drawworld.prototype.drawroom = function(Tcamera, Tpost){
   var h = 1500;
   var l = 1500;   // x direction
   var w = 2000;   // z direction
   var c_r;
   var c_g;
   var c_b;
   var lightd = -1;
   var outdir = 0;
   var cube = [ [l, 0, w], [-l, 0, w], [-l, 0, -w], [l, 0, -w], [l, h, w], [-l, h, w], [-l, h, -w], [l, h, -w] ];
   var planenum = [ [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [0, 3, 7, 4] ]; // the corresponding corners of each plane
   // make 6 squares(poly), and all put into shapelist
   for(var k = 0; k < 6 ; ++k){
      if(k == 0){//the floor
         c_r = 112;
         c_g = 160;
         c_b = 219;
      }
      else if(k == 1){// the ceiling
         c_r = 100;
         c_g = 100;
         c_b = 100;
      }
      else if(k == 2 || k == 4){
         c_r = 91;
         c_g = 64;
         c_b = 33;
      }
      else if(k == 3 || k == 5){
         c_r = 90;
         c_g = 50;
         c_b = 11;
      }
      // create shadow
      var outdir = this.calout(cube[planenum[k][0]], cube[planenum[k][1]], cube[planenum[k][2]]);
      var p = new poly(Tcamera, lightd, outdir, c_r, c_g, c_b);
      for(var i = 0; i < 4; ++i)
         p.insertnode(cube[planenum[k][i]]);
      p.render(Tcamera);
      this.shapelist.insert(p);
   }
}
drawworld.prototype.calout = function(n1, n2, n3){
   var a = [n2[0]-n1[0], n2[1]-n1[1], n2[2]-n1[2]];
   var b = [n3[0]-n1[0], n3[1]-n1[1], n3[2]-n1[2]];
   var out = [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
   var l = Math.sqrt(out[0]*out[0] + out[1]*out[1] + out[2]*out[2]);
   var outw = [out[0]/l, out[1]/l, out[2]/l];
   return outw;
}
drawworld.prototype.drawDesk = function(Tcamera, Tpost, lightd, c_r , c_g, c_b){
   var h = 200;
   var r = 60;
   var r2 = 60 / Math.sqrt(2);
   var points = [ [0, 0, r], [r2, 0, r2], [r, 0, 0], [r2, 0, -r2], [0, 0, -r], [-r2, 0, -r2], [-r, 0, 0], [-r2, 0, r2],
                  [0, h, r], [r2, h, r2], [r, h, 0], [r2, h, -r2], [0, h, -r], [-r2, h, -r2], [-r, h, 0], [-r2, h, r2] ];
   var planenum = [  [0, 7, 6, 5, 4, 3, 2, 1], 
                     [8, 9, 10, 11, 12, 13, 14, 15],
                     [0, 1, 9, 8], [1, 2, 10, 9], [2, 3, 11, 10], [3, 4, 12, 11],
                     [4, 5, 13, 12], [5, 6, 14, 13], [6, 7, 15, 14], [7, 0, 8, 15]  ]
   for(var k = 0; k < planenum.length ; ++k){
      // create shadow
      var outdir = this.calout(points[planenum[k][0]], points[planenum[k][1]], points[planenum[k][2]]);
      var p = new poly(Tcamera, lightd, outdir, c_r, c_g, c_b);// the whole points is same color
      for(var i = 0; i < planenum[k].length; ++i)
         p.insertnode(points[planenum[k][i]]);
      p.render(Tcamera);
      this.shapelist.insert(p);
   }

}
drawworld.prototype.moveToTx = function(x,y,z,Tx1, Tx2) {
   var loc = [x,y,z];
   var locTx1 = this.m4.transformPoint(Tx1,loc);
   if(locTx1[2] >= 0)locTx1[2] = -1;
   var locTx2 = this.m4.transformPoint(Tx2, locTx1);
   this.context.moveTo(locTx2[0], locTx2[1]);
}
drawworld.prototype.lineToTx = function(x,y,z,Tx1, Tx2) {
   var loc = [x,y,z];
   var locTx1 = this.m4.transformPoint(Tx1,loc);
   if(locTx1[2] >= 0)locTx1[2] = -1;// a wrong way, the direction might change, but not obvious
   var locTx2 = this.m4.transformPoint(Tx2, locTx1);
   this.context.lineTo(locTx2[0], locTx2[1]);
}

drawworld.prototype.drawAxes = function(Tx1, Tx2){
   this.context.beginPath();
   this.moveToTx(0,0,0,Tx1, Tx2);this.lineToTx(150,0,0,Tx1, Tx2);this.context.stroke();
   this.moveToTx(0,0,0,Tx1, Tx2);this.lineToTx(0,150,0,Tx1, Tx2);this.context.stroke();
   this.moveToTx(0,0,0,Tx1, Tx2);this.lineToTx(0,0,150,Tx1, Tx2);this.context.stroke();
}
drawworld.prototype.drawCube = function(Tx1, Tx2, height= 50, length = 40, width = 40){
   this.context.beginPath();
   var h = height;
   var l = length / 2;
   var w = width / 2;
   this.moveToTx(-l,0,-w,Tx1, Tx2);this.lineToTx(l,0,-w,Tx1, Tx2);
   this.lineToTx(l,h,-w,Tx1, Tx2);this.lineToTx(-l,h,-w,Tx1, Tx2);this.context.stroke();
   this.moveToTx(l,0,-w,Tx1, Tx2);this.lineToTx(l,0,w,Tx1, Tx2);
   this.lineToTx(l,h,w,Tx1, Tx2);this.lineToTx(l,h,-w,Tx1, Tx2);this.context.stroke();
   this.moveToTx(l,0,w,Tx1, Tx2);this.lineToTx(-l,0,w,Tx1, Tx2);
   this.lineToTx(-l,h,w,Tx1, Tx2);this.lineToTx(l,h,w,Tx1, Tx2);this.context.stroke();
   this.moveToTx(-l,0,w,Tx1, Tx2);this.lineToTx(-l,0,-w,Tx1, Tx2);
   this.lineToTx(-l,h,-w,Tx1, Tx2);this.lineToTx(-l,h,w,Tx1, Tx2);this.context.stroke();
   /*this.context.beginPath();
   this.moveToTx(-l, 0, w, Tx1, Tx2);this.lineToTx(-l, 0, -w, Tx1, Tx2);
   this.lineToTx(l, 0, -w, Tx1, Tx2);this.lineToTx(l, 0, w, Tx1, Tx2);
   this.context.closePath();
   this.context.fillStyle = "#FFFFFF";
   this.context.fill();*/
}
drawworld.prototype.drawpoly = function(poly, Tcamera, Tpost){
   //console.log(poly.noshow);
   if(poly.noshow == 1)return;
   var color = "rgb("+poly.c_r+", "+poly.c_g+", "+poly.c_b+")";
   this.context.beginPath();
   for (var i = 0 ; i < poly.node.length ; ++i){
      if(i == 0)this.moveToTx(poly.node[i][0], poly.node[i][1], poly.node[i][2], Tcamera, Tpost);
      else this.lineToTx(poly.node[i][0], poly.node[i][1], poly.node[i][2], Tcamera, Tpost);
   }
   this.context.closePath();
   this.context.fillStyle = color;
   this.context.fill();
   //this.context.stroke();
}
drawworld.prototype.addCube = function(Tcamera, lightd, c_r, c_g, c_b, height = 50, length = 40, width = 40){
   var h = height;
   var l = length / 2;
   var w = width / 2;
   var cube = [ [l, 0, w], [-l, 0, w], [-l, 0, -w], [l, 0, -w], [l, h, w], [-l, h, w], [-l, h, -w], [l, h, -w] ];
   var planenum = [ [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [0, 3, 7, 4] ]; // the corresponding corners of each plane
   // make 6 squares(poly), and all put into shapelist
   for(var k = 0; k < 6 ; ++k){
      // create shadow
      var outdir = this.calout(cube[planenum[k][0]], cube[planenum[k][1]], cube[planenum[k][2]]);
      var p = new poly(Tcamera, lightd, outdir, c_r, c_g, c_b);// the whole cube is same color
      for(var i = 0; i < 4; ++i)
         p.insertnode(cube[planenum[k][i]]);
      p.render(Tcamera);
      this.shapelist.insert(p);
   }
}
