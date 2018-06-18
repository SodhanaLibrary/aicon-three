const AnimaticonUtils = {
  animateVector3(vectorToAnimate, target, options){
    options = options || {};
    // get targets from options or set to defaults
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;
    // create the tween
    var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if(options.update){
                options.update(d);
            }
         })
        .onComplete(function(){
          if(options.callback) options.callback();
        });
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
  },


  tweenCustomVar(obj, target, options) {
    console.log(obj, target, options);
    options = options || {};
    var easing = options.easing || TWEEN.Easing.Linear.None,
        duration = options.duration || 2000,
        variable = options.variable || 'opacity',
        tweenTo = {};
    tweenTo[variable] = target; // set the custom variable to the target
    var tween = new TWEEN.Tween(obj)
        .to(tweenTo, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if(options.update){
                options.update(d);
            }
        })
        .onComplete(function(){
             if(options.callback) {
                 options.callback();
             }
        });
    return tween;
   }


}

window.animaticonObjects.AnimaticonUtils = AnimaticonUtils;
