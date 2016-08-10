
//These are all taken from here: https://github.com/ProjectSeptemberInc/gl-react-dom/blob/master/Examples/Simple/Blur1D.js
//They are open gl filters written in c
//some were pulled from here too: http://web.engr.oregonstate.edu/~mjb/glman/Examples/Image/image.frag


let filters = { saturate : {
            frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D image;
uniform float factor;
void main () {
  vec4 c = texture2D(image, uv);
  // Algorithm from Chapter 16 of OpenGL Shading Language
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  gl_FragColor = vec4(mix(vec3(dot(c.rgb, W)), c.rgb, factor), c.a);
}
    `
        },
        brighten: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D image;
uniform float factor;
void main () {
  vec4 c = texture2D(image, uv);
  // Algorithm from Chapter 16 of OpenGL Shading Language
  const vec3 W = vec3(  0., 0., 0. );
  gl_FragColor = vec4(mix(vec3(dot(c.rgb, W)), c.rgb, factor), c.a);
}
    `
  },
 contrast: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D image;
uniform float factor;
void main () {
  vec4 c = texture2D(image, uv);
  // Algorithm from Chapter 16 of OpenGL Shading Language
  const vec3 W = vec3( 0.5, 0.5, 0.5 );
  gl_FragColor = vec4(mix(vec3(dot(c.rgb, W)), c.rgb, factor), c.a);
}
    `
  }


    }

export default filters