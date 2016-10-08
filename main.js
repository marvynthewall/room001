"use strict"
function run(){
   var canvas = document.getElementById("mycanvas");
   var context = canvas.getContext('2d');
   var m4 = twgl.m4;

   var slider1 = document.getElementById("slider1");
   var slider2 = document.getElementById("slider2");
   var slider3 = document.getElementById("slider3");
   var slider4 = document.getElementById("slider4");
   var slider5 = document.getElementById("slider5");
   var world = new drawworld(canvas, context, m4);

   var maxdistance = 500;
   var center = [0, 200, 0];
   var lightd = [2, 1, 3];
   var lll = Math.sqrt(lightd[0] * lightd[0] + lightd[1] * lightd[1] + lightd[2] * lightd[2]);
   lightd = [lightd[0]/lll, lightd[1]/lll, lightd[2]/lll];
   function draw(){
      canvas.width=canvas.width;
      world.renew();
      var phi = Math.PI*slider3.value/100;
      var theta = Math.PI*2*slider2.value/200;
      //var theta = Math.PI/5;
      var r = maxdistance*slider1.value/100;
      for(;center[1]+r*Math.cos(phi) >= 600 || center[1] + r*Math.cos(phi) <= 0; r -= 10);
      slider1.value = r * 100 / maxdistance;
      var eye = [ center[0] + r * Math.sin(phi) * Math.cos(theta), center[1] + r * Math.cos(phi) , center[2] + r * Math.sin(phi) * Math.sin(theta)];
      var target = center;
      var up = [0, 1, 0];
      var Tlookat = m4.lookAt(eye, target, up);
      var Tcamera = m4.inverse(Tlookat);
      //var Tprojection = m4.ortho(-100, 100, -100, 100, -10, 10);
      var Tprojection = m4.perspective(Math.PI/9, 1, 100, 110);
      var TT = m4.multiply(Tcamera, Tprojection);
      var Tviewport = m4.multiply(m4.scaling([200,-200,200]),m4.translation([canvas.width/2,canvas.height/2,0]));
      TT = m4.multiply(TT, Tviewport);
      var Tpost = m4.multiply(Tprojection, Tviewport);

      //world.drawCube(Tcamera, Tpost);
      /*
      //try area
      var vv = parseInt(slider4.value);
      var p = new poly(50, 50, 250);
      p.insert(0, 0, vv);
      p.insert(0, vv, 0);
      p.insert(vv, 0, 0);
      p.printnode();
      p.clip(Tcamera);
      p.printnode();
      world.drawpoly(p, Tcamera, Tpost);

      var v = slider5.value;
      var s = new poly(50, 250, 50);
      s.insert(50, 0, 50);
      s.insert(50, 20, 50);
      s.insert(50, 20, 2*parseInt(v)+50);
      s.insert(50, 0, 2*parseInt(v)+50);
      s.clip(Tcamera);
      world.drawpoly(s, Tcamera, Tpost);
      //try area
      */
      world.drawAll(Tcamera, Tpost, lightd);
      //world.drawAxes(Tcamera, Tpost);

   }
   slider1.addEventListener("input", draw);
   slider2.addEventListener("input", draw);
   slider3.addEventListener("input", draw);
   slider4.addEventListener("input", draw);
   slider5.addEventListener("input", draw);
   draw();
}
window.onload = run;
