
//These are all taken from here: https://github.com/ProjectSeptemberInc/gl-react-dom/blob/master/Examples/Simple/Blur1D.js
//They are open gl filters written in c


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
        blur: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform vec2 direction;
uniform vec2 resolution;
// from https://github.com/Jam3/glsl-fast-gaussian-blur
vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}
void main () {
  gl_FragColor = blur13(t, uv, resolution, direction);
}
    `
  },

hue:  {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform float hue;
const mat3 rgb2yiq = mat3(0.299, 0.587, 0.114, 0.595716, -0.274453, -0.321263, 0.211456, -0.522591, 0.311135);
const mat3 yiq2rgb = mat3(1.0, 0.9563, 0.6210, 1.0, -0.2721, -0.6474, 1.0, -1.1070, 1.7046);
void main() {
  vec3 yColor = rgb2yiq * texture2D(tex, uv).rgb;
  float originalHue = atan(yColor.b, yColor.g);
  float finalHue = originalHue + hue;
  float chroma = sqrt(yColor.b*yColor.b+yColor.g*yColor.g);
  vec3 yFinalColor = vec3(yColor.r, chroma * cos(finalHue), chroma * sin(finalHue));
  gl_FragColor = vec4(yiq2rgb*yFinalColor, 1.0);
}
    `
  }

    }

export default filters