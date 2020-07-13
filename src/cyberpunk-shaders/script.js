const { webglUtils, m4 } = window
const CANVAS = document.querySelector('canvas')
// const CTX = CANVAS.getContext('2d')
const gl = CANVAS.getContext('webgl')
const TEXTURE = gl.createTexture()

var program = webglUtils.createProgramFromScripts(gl, [
  'vertex-shader',
  'fragment-shader',
])

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, 'a_position')
var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord')

// lookup uniforms
var matrixLocation = gl.getUniformLocation(program, 'u_matrix')
var textureLocation = gl.getUniformLocation(program, 'u_texture')

// Create a buffer.
var positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// Put a unit quad in the buffer
var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// Create a buffer for texture coords
var texcoordBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)

// Put texcoords in the buffer
var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW)

gl.bindTexture(gl.TEXTURE_2D, TEXTURE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

const CYB = new Image()
// This pleases the canvas
CYB.crossOrigin = 'Anonymous'
CYB.src = 'https://assets.codepen.io/605876/cybr.jpg'

const render = () => {
  CANVAS.width = CYB.width
  CANVAS.height = CYB.height

  gl.bindTexture(gl.TEXTURE_2D, TEXTURE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, CYB)

  gl.bindTexture(gl.TEXTURE_2D, TEXTURE)

  // Tell WebGL to use our shader program pair
  gl.useProgram(program)

  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.enableVertexAttribArray(texcoordLocation)
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)

  // this matrix will convert from pixels to clip space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1)

  // this matrix will translate our quad to dstX, dstY
  matrix = m4.translate(matrix, 0, 0, 0)

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.translate(matrix, CYB.width * 0.5, CYB.height * 0.5, 0)
  matrix = m4.zRotate(matrix, scale)
  matrix = m4.translate(matrix, CYB.width * -0.5, CYB.height * -0.5, 0)

  matrix = m4.scale(matrix, CYB.width, CYB.height, 1)
  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix)

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0)

  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  // Clears the canvas?
  // gl.clear(gl.COLOR_BUFFER_BIT)
}

let scale = 1
const loop = () => {
  scale += Math.PI / 180
  render()
  requestAnimationFrame(loop)
}
loop()
CYB.addEventListener('load', render)
