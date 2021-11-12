# CG Lab Project

Submission template for the CG lab project at the Johannes Kepler University Linz.

### Explanation

This `README.md` needs to be pushed to Github for each of the 3 delivery dates.
For every submission change/extend the corresponding sections by replacing the *TODO* markers. Make sure that you push everything to your Github repository before the respective deadlines. For more details, see the Moodle page.

## Concept submission due on 26.03.2021

### Group Members

|               | Student ID    | First Name  | Last Name      | E-Mail         |
|---------------|---------------|-------------|----------------|----------------|
| **Student 1** | K11841346         | ghilas       | Belkaci          | ghilas.belkaci@gmail.com         |
| **Student 2** | TODO          | TODO        | TODO           | TODO           |

### Concept Submission due on 26.03.2021

A car is parked in a place. The car starts and it's drives through a path in the direction of a dwelling. The car hit the dwelling and a fire starts.

### Special Effects

Selected special effects must add up to exactly 30 points. Replace yes/no with either yes or no.

| Selected   | ID | Name                                  | Points |
|------------|----|---------------------------------------|--------|
| yes     | S1 | Multi texturing                       | 10     |  
| yes/no     | S2 | Level of detail                       | 10     |
| yes/no     | S3 | Billboarding                          | 10     |
| yes/no     | S4 | Terrain from heightmap                | 20     |
| yes/no     | S5 | Postprocessing shader                 | 20     |
| yes/no     | S6 | Animated water surface                | 20     |
| yes/no     | S7 | Minimap                               | 20     |
| yes   | S8 | Particle system (rain, smoke, fire)   | 20     |
| yes/no     | S9 | Motion blur                           | 30     |
| yes/no     | SO | Own suggestion (preapproved by email) | TODO   |

## Intermediate Submission due on 23.04.2021

Prepare a first version of your movie that:
 * is 30 seconds long,
 * contains animated objects, and
 * has an animated camera movement. 

Push your code on the day of the submission deadline. 
The repository needs to contain:
  * code/ Intermediate code + resources + libs
  * video/ A screen recording of the intermediate result

Nothing to change here in `README` file.

**Note:** You don’t need to use any lighting, materials, or textures yet. This will be discussed in later labs and can be added to the project afterwards!

## Final Submission due on 22.06.2021

The repository needs to contain:
  * code/ Documented code + resources + libs
  * video/ A screen recording of the movie
  * README.md


### Workload

| Student ID     | Workload (in %) |
| ---------------|-----------------|
|	 K11841346        |100%         |
| TODO           | TODO            |

Workload has to sum up to 100%.

### Effects

Select which effects you have implemented in the table below. Replace yes/no/partial with one of the options.
Mention in the comments column of the table where you have implemented the code and where it is visible (e.g., spotlight is the lamp post shining on the street). 

| Implemented    | ID | Name                                                                                                   | Max. Points | Issues/Comments |
|----------------|----|--------------------------------------------------------------------------------------------------------|-------------|-----------------|
| yes | 1a | Add at least one manually composed object that consists of multiple scene graph nodes.                 | 6           |               the car  |
| yes | 1b | Animate separate parts of the composed object and also move the composed object itself in the scene.   | 4           |              wiper of the car   |
| yes | 1c | Use at least two clearly different materials for the composed object.                                  | 3           |                 |
| yes | 2a | Create one scene graph node that renders a complex 3D shape. Fully specify properties for this object. | 7           |   house              |
| yes| 2b | Apply a texture to your self-created complex object by setting proper texture coordinates.             | 3           |                 |
| yes| 3a | Use multiple light sources.                                                                            | 5           |                 |
| yes | 3b | One light source should be moving in the scene.                                                        | 3           |                 |
| yes | 3c | Implement at least one spot-light.                                                                     | 8           |                 |
| yes | 3d | Apply Phong shading to all objects in the scene.                                                       | 4           |                 |
| yes| 4  | The camera is animated 30 seconds without user intervention. Animation quality and complexity of the camera and the objects influence the judgement.                                                                       | 7           |                 |
|partial | Sx | multitexturing                                                                              | TODO        |                 |
| partial | Sy | particle system                                                                              | TODO        |                 |
|partial | SE | Special effects are nicely integrated and well documented                                              | 20          |                 |

### Special Effect Description

TODO

Describe how the effects work in principle and how you implemented them. If your effect does not work but you tried to implement it, make sure that you explain this. Even if your code is broken do not delete it (e.g., keep it as a comment). If you describe the effect (how it works, and how to implement it in theory), then you will also get some points. If you remove the code and do not explain it in the README this will lead to 0 points for the effect and the integration SE.



Multitexturing 
I implemented multitexturing, the result is visible in the project, but it is not 100% perfect. 
I will try here to explain the steps that I followed to implement the multitexturing

1)	I uploaded 2 images floor.jpg and beton.jpg that will represent our 2 textures for the multitexturing

 
          loadResources({
  
  
                floortexture: './src/models/floor.jpg',
  
                 floortextureb: './src/models/beton.jpg',


           })

2)	I created 2 WebGL texture functions and I upload the texture data that is represented by the 2 images


       
       
       
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


3)	In the fragment shader I defined textures sampler and textures coordinates 

        varying vec2 v_texCoord;
        uniform sampler2D u_texMult;
        uniform sampler2D u_tex1;

4)	I made addition to the two textures in the shader

       if(u_enableObjectTextureMult)
        {
   
       vec4 FirstTexture = texture2D(u_texMult, v_texCoord);
       vec4 SecondTexture  = texture2D(u_tex1, v_texCoord);
       gl_FragColor = (FirstTexture + SecondTexture );
 
     
    
    
       return; 
     }


5)	I also create two classes TextureSGNodeMult and TextureSGNodeNew which extends SGNode and I bound a textures to texture unit 

       gl.uniform1i(gl.getUniformLocation(context.shader,'u_texMult'), this.textureunit);


       gl.uniform1i(gl.getUniformLocation(context.shader,'u_tex1'), this.textureunit);

--------------------------------------------------------------------------------------------------------

Particle system
For this special effect, I implement a code, but it is not fully working.

A particle system is a a group of independent particles, each of them can be described by a set of parameters. The particles can appear or disappear depending on time.

I created to files for the vertex and fragment shader.

In the vertex shader I defined this parameters 

varying  vec2 Particle_Position;

varying  float Particle_lifeTime;

varying  float Particle_Duration;

varying  vec2 Particle_Direction;



Particle_Position represents the position of the particles.

Particle_lifeTime represent the time the particle has been alive.

Particle_Duration represents the time that the particle should be visible.

Particle_Direction represents in which direction the particles should go.

