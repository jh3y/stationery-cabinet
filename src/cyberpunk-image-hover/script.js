const { p5, gsap } = window

const CANVI = [...document.querySelectorAll('.img')]

const IMAGES = [
  'https://assets.codepen.io/605876/cybr.jpg',
  'https://assets.codepen.io/605876/cybr.jpg',
]

// let fsv = `
//   precision highp float random(vec2 co)
//   {
//     highp float a = 12.9898;
//     highp float b = 78.233;
//     highp float c = 43758.5453;
//     highp float dt= dot(co.xy ,vec2(a,b));
//     highp float sn= mod(dt,3.14);
//     return fract(sin(sn) * c);
//   }
//   float voronoi( in vec2 x ) {
//     vec2 p = floor( x );
//     vec2 f = fract( x );
//     float res = 8.0;
//     for( float i=-1.; i<=1.; i++ ) {
//       vec2  b = vec2( i, j );
//       vec2  r = b - f + random( p + b );
//       float d = dot( r, r );
//       res = min( res, d );
//     }
//     return sqrt( res );
//   }
//   vec2 displace(vec4 tex, vec2 texCoord, float dotDepth, float textureDepth, float strength) {
//     float b = voronoi(.003 * texCoord + 2.0);
//     float g = voronoi(0.2 * texCoord);
//     float r = voronoi(texCoord - 1.0);
//     vec4 dt = tex * 1.0;
//     vec4 dis = dt * dotDepth + 1.0 - tex * textureDepth;

//     dis.x = dis.x - 1.0 + textureDepth*dotDepth;
//     dis.y = dis.y - 1.0 + textureDepth*dotDepth;
//     dis.x *= strength;
//     dis.y *= strength;
//     vec2 res_uv = texCoord;
//     res_uv.x = res_uv.x + dis.x - 0.0;
//     res_uv.y = res_uv.y + dis.y;
//     return res_uv;
//   }

//   float ease1(float t) {
//     return t == 0.0 || t == 1.0
//     ? t
//     : t < 0.5
//     ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
//     : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
//   }
//   float ease2(float t) {
//     return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
//   }

//   vec4 transition(vec2 uv) {
//     vec2 p = uv.xy / vec2(1.0).xy;
//     vec4 color1 = getFromColor(p);
//     vec4 color2 = getToColor(p);
//     vec2 disp = displace(color1, p, 0.33, 0.7, 1.0-ease1(progress));
//     vec2 disp2 = displace(color2, p, 0.33, 0.5, ease2(progress));
//     vec4 dColor1 = getToColor(disp);
//     vec4 dColor2 = getFromColor(disp2);
//     float val = ease1(progress);
//     vec3 gray = vec3(dot(min(dColor2, dColor1).rgb, vec3(0.299, 0.587, 0.114)));
//     dColor2 = vec4(gray, 1.0);
//     dColor2 *= 2.0;
//     color1 = mix(color1, dColor2, smoothstep(0.0, 0.5, progress));
//     color2 = mix(color2, dColor1, smoothstep(1.0, 0.5, progress));
//     return mix(color1, color2, val);
//     //gl_FragColor = mix(gl_FragColor, dColor, smoothstep(0.0, 0.5, progress));
//     //gl_FragColor = mix(texture2D(from, p), texture2D(to, p), progress);
//   }
// `

// the vertex shader is called for each vertex
let fs = `
precision mediump float;

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform vec2 resolution;


float amt = 0.1; // the amount of displacement, higher is more
float squares = 20.0; // the number of squares to render vertically

void main() {
  float aspect = resolution.x / resolution.y;
  float offset = amt * 0.5;

  vec2 uv = vTexCoord;

  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;

  // copy of the texture coords
  vec2 tc = uv;

  // move into a range of -0.5 - 0.5
  uv -= 0.5;

  // correct for window aspect to make squares
  uv.x *= aspect;

  // tile will be used to offset the texture coordinates
  // taking the fract will give us repeating patterns
  vec2 tile = fract(uv * squares + 0.5) * amt;

  // sample the texture using our computed tile
  // offset will remove some texcoord edge artifacting
  vec4 tex = texture2D(tex0, tc + tile - offset);

  // render the output
  gl_FragColor = tex;
}
`

// the fragment shader is called for each pixel
let vs = `
// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// lets get texcoords just for fun!
varying vec2 vTexCoord;

void main() {
  // copy the texcoords
  vTexCoord = aTexCoord;

  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}
`

// let vsBasic = `
//   attribute vec4 a_position;
//   attribute vec2 a_texcoord;

//   uniform mat4 u_matrix;

//   varying vec2 v_texcoord;

//   void main() {
//     gl_Position = u_matrix * a_position;
//     v_texcoord = a_texcoord;
//   }
// `

// let fsBasic = `
//   precision mediump float;

//   varying vec2 v_texcoord;

//   uniform sampler2D u_texture;

//   void main() {
//     gl_FragColor = texture2D(u_texture, v_texcoord);
//   }
// `

const PARAMS = {
  RESX: 200,
}

// let
const shared = imageUrl => p => {
  let img = null
  // let r = 0
  let sceneShader
  // let basicShader
  // let shaded
  p.preload = () => {
    img = p.loadImage(imageUrl)
  }
  p.setup = () => {
    p.createCanvas(200, 200, p.WEBGL)
    // basicShader = p.createShader(vsBasic, fsBasic)
    sceneShader = p.createShader(vs, fs)
    // Explore creating offscreen graphics that you switch between.
    // shaded = p.createGraphics(200, 200, p.WEBGL)
    // p.noStroke()
  }
  p.draw = () => {
    // How do I flip between???
    p.clear()
    if (p.mosaicing) {
      // console.info('SHOW THIS')
      p.shader(sceneShader)
      sceneShader.setUniform('tex0', img)
      sceneShader.setUniform('resolution', [PARAMS.RESX, 200])
      // p.texture(sceneShader)
    } else {
      p.texture(img)
      // p.shader(basicShader)
      // basicShader.setUniform('u_texture', img)
      // basicShader.setUniform('resolution', [200, 200])
    }
    p.rect(-100, -100, 200, 200)
  }
}
// TODO: Have a look at vertex and box etc.
// Texture is what we use to render something onto the canvas. So the image.

const One = new p5(shared(IMAGES[0]), CANVI[0])

const MOSEY = gsap
  .timeline({ paused: false })
  .to(PARAMS, { RESX: 1000, yoyo: true, duration: 5, repeat: -1 })

CANVI[0].addEventListener('click', () => {
  // console.info('Tappy')
  One.mosaicing = !One.mosaicing
  if (One.mosaicing) {
    MOSEY.play()
  } else {
    MOSEY.pause()
  }
})
