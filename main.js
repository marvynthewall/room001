"use strict"
function run(){
   var canvas = document.getElementById("mycanvas");
   var context = canvas.getContext('2d');
   var m4 = twgl.m4;

   var slider4 = document.getElementById("slider4");
   var slider5 = document.getElementById("slider5");
   var world = new drawworld(canvas, context, m4);
   
   var body = document.getElementById("body");
   body.addEventListener("keypress", keyboard);
   var maxdistance = 1400;
   var center = [0, 400, 0];
   var lightd = [2, 1, 3];
   var lll = Math.sqrt(lightd[0] * lightd[0] + lightd[1] * lightd[1] + lightd[2] * lightd[2]);
   lightd = [lightd[0]/lll, lightd[1]/lll, lightd[2]/lll];
   
   var r = maxdistance;
   var phi = Math.PI*45/100;
   var theta = Math.PI/5;
   var dr = 10;
   var rmin = 20;
   var rmax = maxdistance;
   var dphi = Math.PI/200;
   var dtheta = Math.PI/200;
   var maxphi = Math.PI*99/100;
   var minphi = Math.PI/100;
   function keyboard(e){
      if(e.which || e.keyCode){
         var ch = e.which || e.keyCode;
         console.log(ch);
         if(ch == 87 || ch == 119){
            phi -= dphi;
            if(phi < minphi)phi = minphi;
         }
         else if(ch == 83 || ch == 115){
            phi += dphi;
            if(phi > maxphi)phi = maxphi;
         }
         else if(ch == 68 || ch == 100 || ch == 65 || ch == 97){
            if(ch == 68 || ch == 100)
               theta -= dtheta;
            else theta += dtheta;
            if(theta > 2*Math.PI)theta -= 2 * Math.PI;
            else if(theta < 0)theta +=2*Math.PI;
         }
         else if(ch == 70 || ch == 102){
            r-=dr;  
            if(r < rmin) r = rmin;
         }
         else if(ch == 71 || ch == 103){
            r+=dr;
            if(r > rmax) r = rmax;
         }
      }
   }
   function draw(e){
      canvas.width=canvas.width;
      world.renew();
      
      for(;center[1]+r*Math.cos(phi) >= 1500 || center[1] + r*Math.cos(phi) <= 0; r -= 10);
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
      
      // all light computed in camera world
      var origin = m4.transformPoint(Tcamera, [0,0,0]);
      var lighttrans = m4.transformPoint(Tcamera, lightd);
      var lt = [ lighttrans[0] - origin[0], lighttrans[1] - origin[1], lighttrans[2] - origin[2] ];
      var l = Math.sqrt(lt[0]*lt[0] + lt[1]*lt[1] + lt[2]*lt[2]);
      var lighttransform = [lt[0]/l, lt[1]/l, lt[2]/l];
      world.drawAll(Tcamera, Tpost, lighttransform);
      //world.drawAxes(Tcamera, Tpost);
      
      window.requestAnimationFrame(draw);
   }
   slider4.addEventListener("input", draw);
   slider5.addEventListener("input", draw);
   draw();
}
window.onload = run;
