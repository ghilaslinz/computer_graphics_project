//the OpenGL context
var gl = null,
  program = null;


//Camera
var camera = null;
var cameraPos = vec3.create();
var cameraCenter = vec3.create();
var cameraAnimation = null;
var rotateNodeCar;
var rotateNodeWiper;

var rotateNodeWiperLeft;
var animation = null;
var rotateLight2;
// scenegraph root node
var root = null;
var rotateLight, rotateLight2, rotateNode;
var s = 1; //size of cube
// time in last render step
var previousTime = 0;

//textures
var renderTargetColorTexture;
var renderTargetDepthTexture;
var houseTexture;
var floorTexture;
var floorTextureb;

//load the shader resources using a utility function
loadResources({
  vs: './src/shader/phong.vs.glsl',
  fs: './src/shader/phong.fs.glsl',
  vs_single: './src/shader/single.vs.glsl',
  fs_single: './src/shader/single.fs.glsl',

  //vs_particle: './src/shader/ParticleSystem.vs.glsl',
 // fs_particle: './src/shader/ParticleSystem.vs.glsl',
  car: './src/models/car.obj',

  plate: './src/models/platee.obj',
  floortexture: './src/models/floor.jpg',
  floortextureb: './src/models/beton.jpg',
  housetexture: './src/models/woods.jpg',
}).then(function (resources /*an object containing our keys with the loaded resources*/) {
  init(resources);

  render(0);
});


function init(resources) {
  //create a GL context
  gl = createContext();

  //setup camera
  cameraStartPos = vec3.fromValues(0, 1,-10);
  camera = new UserControlledCamera(gl.canvas, cameraStartPos);
  //setup an animation for the camera, moving it into position
 cameraAnimation = new Animation(camera,
    [{ matrix: mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 1, -10)), duration: 5000 }],
    false);
 
    cameraAnimation = new Animation(camera, 

   [  

    
     
    { matrix: mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 1, -10)), duration: 10000 },
   {matrix: progress => mat4.rotateY(mat4.create(), mat4.translate(mat4.create(), mat4.create(), [0, 1, -10]), glm.deg2rad(180 * progress)), duration: 4000},

     {matrix: mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 4, -52)), duration: 8000},
  
  
    {matrix: mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 1, -5)), duration: 8000},
   
  
           
         ],
      false),


  cameraAnimation.start()
 
   //init textures
   initTextures(resources);
   initTexturesMult(resources);
   initTexturesB(resources);
  root = createSceneGraph(gl, resources);
}


function createSceneGraph(gl, resources) {
  //create scenegraph
  const root = new ShaderSGNode(createProgram(gl, resources.vs, resources.fs))

  // create node with different shaders
  function createLightSphere() {
    return new ShaderSGNode(createProgram(gl, resources.vs_single, resources.fs_single), [
      new RenderSGNode(makeSphere(.2, 10, 10))
    ]);
  }

  // create white light node
  let light = new LightNode();
  light.ambient = [.5, .5, .5, 1];
  light.diffuse = [1, 1, 1, 1];
  light.specular = [1, 1, 1, 1];
  light.position = [0, 2, 30];
  light.append(createLightSphere());
  // add light to scenegraph
  rotateLight = new TransformationSGNode(mat4.create(), [
    light
  ]);
  root.append(rotateLight);
  

  let light2 = new LightNode();
  light2.uniform = 'u_light2';
  light2.ambient = [0, 0, 0, 1];
  light2.diffuse = [1, 0, 0, 1];
  light2.specular = [1, 0, 0, 1];
  light2.position = [0, 4, 15];
  light2.append(createLightSphere());

  root.append(light2);

  let light3 = new LightNode();
  light3.uniform = 'u_light3';
  light3.ambient = [0, 0, 0, 1];
  light3.diffuse = [1, 0, 0, 1];
  light3.specular = [1, 0, 0, 1];
  light3.position = [0, 6, -40];
  light3.append(createLightSphere());
  
  root.append(light3);


  // adapt spotlight for the light4

  let light4 = new LightNode();
  light4.uniform = "u_light4";
  light4.ambient = [.5, .5, .5, 0.5];
  light4.diffuse = [1, 1, 1, 1];
  light4.specular = [1, 1, 1, 1];
  light4.position = [0, 5,6];

  light4.angle = glm.deg2rad(18);
  light4.directionSpotLight = [0, 0, 1];
  light4.append(createLightSphere());
  root.append(light4)


  let floorCar = new MaterialSGNode(
    
    
    new RenderSGNode( makeRect(6, 2))
  );
  floorCar.ambient = [0.2, 0.2, 0.2, 1];
  floorCar.diffuse = [0.1, 0.1, 0.1, 1];
  floorCar.specular = [0.5, 0.5, 0.5, 1];
  floorCar.shininess = 3;
  // create floor
  let floor = new MaterialSGNode(
    new TextureSGNodeMult(floorTexture, 2,
    
    new RenderSGNode(makeFloor())
  ));

  let path = new MaterialSGNode(
    new TextureSGNodeNew(floorTextureb, 2,
    
    new RenderSGNode(makePath())
  ));

  //dark
  floor.ambient = [0.2, 0.2, 0.2, 1];
  floor.diffuse = [0.1, 0.1, 0.1, 1];
  floor.specular = [0.5, 0.5, 0.5, 1];
  floor.shininess = 3;


root.append(new TransformationSGNode(glm.transform({ translate: [0, -1.5, -24], rotateX: -90, scale: 3 }), [
  floor
]));



root.append(new TransformationSGNode(glm.transform({ translate: [0, -1.5, 0], rotateX: -90, scale: 3 }), [
  floorCar
]));




  {
    CarNode = CarComposedObject.create(resources); 
  



  rotateNodeCar = new TransformationSGNode(mat4.create(), [
    new TransformationSGNode(glm.translate(0, 0, 0), [
      CarNode
    ])
  ]);
}
  root.append(rotateNodeCar);
  
  {
    initHouse(resources); 
    root.append(houseNode); 
  }
  return root;
}

function initTextures(resources) {
  //create texture object
  houseTexture = gl.createTexture();
  //select a texture unit
  gl.activeTexture(gl.TEXTURE0);
  //bind texture to active texture unit
  gl.bindTexture(gl.TEXTURE_2D, houseTexture);
  //set sampling parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // change texture sampling behaviour
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //upload texture data
  gl.texImage2D(gl.TEXTURE_2D, //texture unit target == texture type
    0, //level of detail level (default 0)
    gl.RGBA, //internal format of the data in memory
    gl.RGBA, //image format (should match internal format)
    gl.UNSIGNED_BYTE, //image data type
    resources.housetexture); //actual image data
  //clean up/unbind texture
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexturesB(resources) {
  
  floorTextureb = gl.createTexture();
  //select a texture unit
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, floorTextureb);



  //set sampling parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //change texture sampling behaviour
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  

  
  //upload texture data
  gl.texImage2D(gl.TEXTURE_2D, //texture unit target == texture type
    0, //level of detail level (default 0)
    gl.RGBA, //internal format of the data in memory
    gl.RGBA, //image format (should match internal format)
    gl.UNSIGNED_BYTE, //image data type
    resources.floortextureb); //actual image data
   
    
      
  //clean up/unbind texture
  gl.bindTexture(gl.TEXTURE_2D, null);
}
function initTexturesMult(resources) {
  //create texture object
  floorTexture = gl.createTexture();
  
  //select a texture unit
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, floorTexture);
//gl.activeTexture(gl.TEXTURE1);
//gl.bindTexture(gl.TEXTURE_2D, floorTextureb);
  //bind texture to active texture unit


  //set sampling parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // change texture sampling behaviour
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  

  
  //upload texture data
  gl.texImage2D(gl.TEXTURE_2D, //texture unit target == texture type
    0, //level of detail level (default 0)
    gl.RGBA, //internal format of the data in memory
    gl.RGBA, //image format (should match internal format)
    gl.UNSIGNED_BYTE, //image data type
    resources.floortexture); //actual image data
   
    
      
  //clean up/unbind texture
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initRenderToTexture() {
  //check if depth texture extension is supported
  var depthTextureExt = gl.getExtension("WEBGL_depth_texture");
  if (!depthTextureExt) { alert('No depth texture support!!!'); return; }

  //general setup
  gl.activeTexture(gl.TEXTURE0);
 // gl.activeTexture(gl.TEXTURE1);
  //create framebuffer
  renderTargetFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetFramebuffer);

  //check if framebuffer was created successfully
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) { alert('Framebuffer incomplete!'); }

  //clean up
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function makeFloor() {
  var floor = makeRect(6, 6);
  // adapt texture coordinates
  floor.texture = [0, 0, 1, 0, 1, 1, 0, 1];
 
  return floor;
}

function makePath() {
  var path = makeRect(2, 4);
  //adapt texture coordinates
 
  path.texture = [0, 0, 1, 0, 1, 1, 0, 1];
  return path;
}

function renderToTexture(timeInMilliseconds) {

}


function render(timeInMilliseconds) {
  // check for resize of browser window and adjust canvas sizes
  checkForWindowResize(gl);
  renderToTexture(timeInMilliseconds);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  //clear the buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //enable depth test to let objects in front occluse objects further away
  gl.enable(gl.DEPTH_TEST);

  //Create projection Matrix and context for rendering.
  const context = createSGContext(gl);
  context.projectionMatrix = mat4.perspective(mat4.create(), glm.deg2rad(30), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.01, 100);
  context.viewMatrix = mat4.lookAt(mat4.create(), [0, 1, -10], [0, 0, 0], [0, 1, 0]);



  //light2Animation.update(deltaTime);
  // animation.update(deltaTime);
  var deltaTime = timeInMilliseconds - previousTime;
  previousTime = timeInMilliseconds;
  rotateNodeCar.matrix = glm.rotateY(timeInMilliseconds * -0.02);
  //rotateNodeWiper.matrix = glm.rotateX(timeInMilliseconds * -0.02);

  rotateLight.matrix = glm.rotateY(timeInMilliseconds * 0.05);
  rotateNodeWiper.update(deltaTime);
  rotateNodeWiperLeft.update(deltaTime);
  //light2Animation.update(deltaTime);
  // rotateNodeWiper.update(deltaTime);
  //update animation BEFORE camera
  cameraAnimation.update(deltaTime);
  camera.update(deltaTime);

  //At the end of the automatic flight, switch to manual control
  if (!cameraAnimation.running && !camera.control.enabled) {
    camera.control.enabled = true;

  }

  //TODO use your own scene for rendering

  //Apply camera
  camera.render(context);

  //Render scene
  root.render(context);

  //request another call as soon as possible
  requestAnimationFrame(render);
}


class MaterialNode extends SGNode {

  constructor(children) {
    super(children);
    this.ambient = [0.2, 0.2, 0.2, 1.0]; //r, g, b, alpha
    this.diffuse = [0.8, 0.8, 0.8, 1.0];
    this.specular = [0, 0, 0, 1];
    this.emission = [0, 0, 0, 1];
    this.shininess = 0.0;
    this.uniform = 'u_material';
  }

  setMaterialUniforms(context) {
    const gl = context.gl,
      shader = context.shader;

    //set uniforms
    //hint setting a structure element using the dot notation, e.g. u_material.test
    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.ambient'), this.ambient);
    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.diffuse'), this.diffuse);
    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.specular'), this.specular);
    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.emission'), this.emission);
    gl.uniform1f(gl.getUniformLocation(shader, this.uniform + '.shininess'), this.shininess);
  }

  render(context) {
    this.setMaterialUniforms(context);

    //render children
    super.render(context);
  }
}
class LightNode extends TransformationSGNode {

  constructor(position, children, angle, directionSpotLight) {
    super(null, children);
    this.position = position || [0, 0, 0];
    this.ambient = [0, 0, 0, 1];
    this.diffuse = [1, 1, 1, 1];
    this.specular = [1, 1, 1, 1];
    this.angle = angle;
    this.directionSpotLight = directionSpotLight;

    this.uniform = 'u_light';
  }


  computeLightPosition(context) {

    const modelViewMatrix = mat4.multiply(mat4.create(), context.viewMatrix, context.sceneMatrix);
    const pos = [this.position[0], this.position[1], this.position[2], 1];
    return vec4.transformMat4(vec4.create(), pos, modelViewMatrix);
  }

  setLightUniforms(context) {
    const gl = context.gl,
      shader = context.shader,
      position = this.computeLightPosition(context);


    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.ambient'), this.ambient);
    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.diffuse'), this.diffuse);
    gl.uniform4fv(gl.getUniformLocation(shader, this.uniform + '.specular'), this.specular);

    gl.uniform3f(gl.getUniformLocation(shader, this.uniform + 'Pos'), position[0], position[1], position[2]);

    gl.uniform1f(
      gl.getUniformLocation(shader, this.uniform + "angle"),
      this.angle
    );



  }

  render(context) {
    this.setLightUniforms(context);


    this.matrix = glm.translate(this.position[0], this.position[1], this.position[2]);



    super.render(context);
  }
}


let CarComposedObject = new Object();



CarComposedObject.create = function (resources) {
  let model = new MaterialSGNode([
    new RenderSGNode(resources.car)
  ]);
  model.ambient = [0.2295, 0.08825, 0.0275, 1]
  model.diffuse = [0.5508, 0.2118, 0.066, 1];
  model.specular = [0.580594, 0.223257, 0.0695701, 1];
  model.shininess = 51.2;


  let transformNode = new TransformationSGNode(glm.translate(0, -1, 0), [
    model
  ]);

  let plate = new MaterialSGNode([
    new RenderSGNode(resources.plate)
  ]);
  plate.ambient = [0.2, 0.2, 0.2, 1];
  plate.diffuse = [0.1, 0.1, 0.1, 1];
  plate.specular = [0.5, 0.5, 0.5, 1];
  plate.shininess = 3;


  transformNode.append(new TransformationSGNode(glm.transform({ translate: [-0.2, 0.5, -2.6], scale: 0.01, rotateX: 90, rotateY: 180 }), [
    plate
  ]));

  let wiperRight = new MaterialSGNode([
    new RenderSGNode(makeRect(0.07, 0.005))
  ]);
  wiperRight.ambient = [0.2, 0.2, 0.2, 1];
  wiperRight.diffuse = [0.1, 0.1, 0.1, 1];
  wiperRight.specular = [0.5, 0.5, 0.5, 1];
  wiperRight.shininess = 3;


  let wiperOfRight = new TransformationSGNode(glm.transform({ translate: [-0.5, 1.19, 1.42], rotateX: 45, scale: 3 }), [
    wiperRight
  ]);
  rotateWiper = new TransformationSGNode(mat4.create(), [
    wiperOfRight
  ]);

  transformNode.append(rotateWiper);

 
  rotateNodeWiper = new Animation(rotateWiper,
    [{ matrix: progress => mat4.rotateX(mat4.create(), mat4.translate(mat4.create(), mat4.create(), [0, 0, 0]), glm.deg2rad(-10 * progress)), duration: 3000 },
    { matrix: mat4.translate(mat4.create(), mat4.create(), [0, 0, 0]), duration: 3000 }],

    true);
  rotateNodeWiper.start();


  let wiperLeft = new MaterialSGNode([
    new RenderSGNode(makeRect(0.07, 0.005))
  ]);
  wiperLeft.ambient = [0.2, 0.2, 0.2, 1];
  wiperLeft.diffuse = [0.1, 0.1, 0.1, 1];
  wiperLeft.specular = [0.5, 0.5, 0.5, 1];
  wiperLeft.shininess = 3;




  let wiperOfLeft = new TransformationSGNode(glm.transform({ translate: [0.1, 1.19, 1.42], rotateX: 45, scale: 3 }), [
    wiperLeft
  ]);
  rotateWiperLeft = new TransformationSGNode(mat4.create(), [
    wiperOfLeft
  ]);

  transformNode.append(rotateWiperLeft);



  rotateNodeWiperLeft = new Animation(rotateWiperLeft,
    [{ matrix: progress => mat4.rotateX(mat4.create(), mat4.translate(mat4.create(), mat4.create(), [0, 0, 0]), glm.deg2rad(-10 * progress)), duration: 3000 },
    { matrix: mat4.translate(mat4.create(), mat4.create(), [0, 0, 0]), duration: 3000 }],

    true);
  rotateNodeWiperLeft.start();



  return transformNode;





}

class TextureSGNodeMult extends SGNode {
  constructor(texture, textureunit,  children) {
    super(children);
    this.texture = texture;
    this.textureunit = textureunit;
   

   
  }
  

  render(context) {
    //tell shader to use our texture; alternatively we could use two phong shaders: one with and one without texturing support
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTextureMult'), 1);

    //set shader parameters
    // set texture unit to sampler in shader
    gl.uniform1i(gl.getUniformLocation(context.shader,'u_texMult'), this.textureunit);
    //gl.uniform1i(gl.getUniformLocation(context.shader,'u_tex1'), this.textureunit);
    //activate/select texture unit and bind texture
    // activate/select texture unit and bind texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D,this.texture);

 
    super.render(context);

    //clean up
    // activate/select texture unit and bind null
gl.activeTexture(gl.TEXTURE0 +this.textureunit);
//gl.activeTexture(gl.TEXTURE1 +this.textureunit);
gl.bindTexture(gl.TEXTURE_2D,null);


    //disable texturing in shader
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTextureMult'), 0);
  }
}

class TextureSGNodeNew extends SGNode {
  constructor(textureb, textureunitb,  children) {
    super(children);
    this.textureb = textureb;
    this.textureunitb = textureunitb;
   

   
  }
  

  render(context) {
    //tell shader to use our texture; alternatively we could use two phong shaders: one with and one without texturing support
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTextureMult'), 1);

    //set shader parameters
    //set texture unit to sampler in shader
    gl.uniform1i(gl.getUniformLocation(context.shader,'u_tex1'), this.textureunit);
    
    gl.bindTexture(gl.TEXTURE_2D,this.textureb);

  // gl.activeTexture(gl.TEXTURE1 + this.textureunit);
  //  gl.bindTexture(gl.TEXTURE_2D,this.texture)

    //render children
    super.render(context);

    //clean up
    //activate/select texture unit and bind null
gl.activeTexture(gl.TEXTURE1 +this.textureunit);
//gl.activeTexture(gl.TEXTURE1 +this.textureunit);
gl.bindTexture(gl.TEXTURE_2D,null);


    //disable texturing in shader
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTextureMult'), 0);
  }
}


house = {};

houseNode = new SGNode();


function initHouse(resources) {
  let HouseNode = createHouse(resources); 

  houseNode.append(new TransformationSGNode(
    glm.transform({
      translate: [0, 0.5, -37],
      rotateY: 145,
     
    }), [
    HouseNode
  ]
  ));


}


defineHouse = function () {
  var vertices = [
    -1, 2, -1, 				//Roof back face	
    0, 2.5, -1,				
    0, 2, -1,
    1, 2, -1,
    0, 2, -1,
    0, 2.5, -1,

    -1, 2, 1, 			//Roof front face	
    0, 2.5, 1,				
    0, 2, 1,
    1, 2, 1,
    0, 2, 1,
    0, 2.5, 1,

    -1, 2, -1,				//Roof left side
    -1, 2, 1,			
    0, 2.5, -1,
    -1, 2, 1,
    0, 2.5, 1,
    0, 2.5, -1,

    1, 2, -1,			//Roof right side
    0, 2.5, -1,			
    1, 2, 1,
    1, 2, 1,
    0, 2.5, -1,
    0, 2.5, 1,

 


    // Front face building
    -1.0, -2.0, 1.0,
    1.0, -2.0, 1.0,
    1.0, 2.0, 1.0,
    -1.0, 2.0, 1.0,




    // Back face building
    -1.0, -2.0, -1.0,
    -1.0, 2.0, -1.0,
    1.0, 2.0, -1.0,
    1.0, -2.0, -1.0,

    // Bottom face building
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face building
    1.0, -2.0, -1.0,
    1.0, 2.0, -1.0,
    1.0, 2.0, 1.0,
    1.0, -2.0, 1.0,

    // Left face building
    -1.0, -2.0, -1.0,
    -1.0, -2.0, 1.0,
    -1.0, 2.0, 1.0,
    -1.0, 2.0, -1.0



    


  ];

  var Normals = [

    // To be able to calculate the Normals i used this website to understand https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
    // After that i found this tutorial that calculate normals for a cube amd i adapt it for my house https://developer.mozilla.org/fr/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL
    // Front face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,



    // Back face
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,




    // Top face
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom face
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right face
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left face
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,



    
 

    
  ];

  var textureCoordinates = [


//Roof front face	
    1,0,0,
    1,0,0,
    1,0,0,
    1,0,0,
   
//Roof back face	
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,


    
//Roof left side
    1,0,1,
    1,0,1,
    1,0,1,
    1,0,1,
    

//Roof right side
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1,

    
 
    // Front face building
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face building
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Bottom face building
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face building
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face building
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

  ];

  var indexBuffer = [

    ////https://codepen.io/SiVin/pen/yYJrxz
    //roof
    0, 1, 2,
    3, 4, 5,

    6, 7, 8,
    9, 10, 11,

    12, 13, 14,
    15, 16, 17,

    18, 19, 20,
    21, 22, 23,



    //cube
    24, 25, 26,
    24, 26, 27,

    28, 29, 30,
    28, 30, 31,

    32, 33, 34,
    32, 34, 35,

    36, 37, 38,
    36, 38, 39,

    40, 41, 42,
    40, 42, 43,

  ];

  return function () {
    return (
      {
        position: vertices,
        normal: Normals,
        texture: textureCoordinates,
        index: indexBuffer
      }
    );
  };
}();

createHouse = function () {
  let house = new MaterialSGNode(
    new TextureSGNode(houseTexture, 2,
      new RenderSGNode(defineHouse())
    ));
  house.ambient =   [0.2, 0.2, 0.2, 1];
  house.diffuse = [0.1, 0.1, 0.1, 1];
  house.specular = [0.5, 0.5, 0.5, 1];
  house.shininess = 3;



  return house;

}



class TextureSGNode extends SGNode {
  constructor(texture, textureunit, children) {
    super(children);
    this.texture = texture;
    this.textureunit = textureunit;
  }

  render(context) {
    //tell shader to use our texture
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTexture'), 1);

    //set additional shader parameters
    //set texture unit
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_tex'), this.textureunit);
 

    
    //activate/select texture unit and bind texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    //render children
    super.render(context);

    //clean up
    // activate/select texture unit and bind null as texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit); //set active texture unit since it might have changed in children render functions
    gl.bindTexture(gl.TEXTURE_2D, null);

    //disable texturing in shader
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTexture'), 0);
  }
}
