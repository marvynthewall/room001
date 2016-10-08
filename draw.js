"use strict"
function drawworld(canv, cont, m){
   this.canvas = canv;
   this.context = cont;
   this.m4 = m;
   this.shapelist = new shapelist();
}
drawworld.prototype.renew = function(){
   this.shapelist.clear();
}
drawworld.prototype.drawAll = function(Tcamera, Tpost, lightd){
   // the room
   this.drawroom(Tcamera, Tpost);
   this.drawshapes(Tpost);
   // just some cube
   var Ttrans = this.m4.translation([0, 250, 0]);
   var Tcom = this.m4.multiply(Ttrans, Tcamera);
   this.addCube(Tcom, Tpost, lightd, 100, 255, 150);
   // the desk
   this.drawDesk(Tcamera, Tpost, lightd, 90, 50, 15);
   this.drawshapes(Tpost);
}
drawworld.prototype.drawshapes = function(Tpost){
   var l = this.shapelist.list.length;
   for(var i = 0 ; i < l ; ++i)
      this.drawpoly(this.shapelist.list[i], this.shapelist.list[i].Tcamera, Tpost);
   this.renew();
}
drawworld.prototype.drawroom = function(Tcamera, Tpost){
   var h = 600;
   var l = 600;   // x direction
   var w = 800;   // z direction
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
   console.log(n1);
   console.log(n2);
   console.log(n3);
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
      console.log("hi");
      console.log(planenum[k][1]);
      console.log(points[planenum[k][1]]);
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
   this.context.stroke();
}
drawworld.prototype.addCube = function(Tcamera, Tpost, lightd, c_r, c_g, c_b, height = 50, length = 40, width = 40){
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
