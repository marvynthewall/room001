"use strict"

function shapelist(){
   this.list = [];
   this.num = 0;
}
shapelist.prototype.clear = function(){
   this.list = [];
   this.num = 0;
}
shapelist.prototype.insert = function(s){// insert: a poly
   for(var i = 0 ; i <= this.num ; ++i){
      if(i == this.num){
         this.list.push(s);
         ++this.num;
         break;
      }
      else if(s.dis < this.list[i].dis) continue;
      else {
         this.list.splice(i,0,s);
         ++this.num;
         break;
      }
   }
}
shapelist.prototype.remove = function(pos){
   this.list.splice(pos, 1);// delete
}
