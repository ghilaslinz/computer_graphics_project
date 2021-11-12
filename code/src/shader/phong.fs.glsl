/**
 * a phong shader implementation
 * Created by Samuel Gratzl on 29.02.2016.
 */
precision mediump float;

/**
 * definition of a material structure containing common properties
 */
struct Material {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 emission;
	float shininess;
};

/**
 * definition of the light properties related to material properties
 */
struct Light {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
};

struct SpotLight {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	float angle;
	vec3 directionSpotLight; 
	
};

// use uniform for material
/*Material material = Material(vec4(0.24725, 0.1995, 0.0745, 1.),
														vec4(0.75164, 0.60648, 0.22648, 1.),
														vec4(0.628281, 0.555802, 0.366065, 1.),
														vec4(0., 0., 0., 0.),
														50.0);
*/
uniform Material u_material;

//use uniform for light
/*
Light light = Light(vec4(0., 0., 0., 1.),
										vec4(1., 1., 1., 1.),
										vec4(1., 1., 1., 1.));
										*/
uniform Light u_light;
uniform Light u_light2;
uniform Light u_light3;
uniform SpotLight u_light4;


//varying vectors for light computation
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
varying vec3 v_light2Vec;
varying vec3 v_light3Vec;

varying vec3 v_light4Vec;
varying vec3 v_light4directionSpotLightVec;

//texture related variables
uniform bool u_enableObjectTextureMult;
uniform bool u_enableObjectTexture; //note: boolean flags are a simple but not the best option to handle textured and untextured objects
// define texture sampler and texture coordinates
varying vec2 v_texCoord;
uniform sampler2D u_tex;
uniform sampler2D u_texMult;
uniform sampler2D u_tex1;
vec4 calculateSimplePointLight(Light light, Material material, vec3 lightVec,
																vec3 normalVec, vec3 eyeVec/*, vec4 textureColor*/) {
  // You can find all built-in functions (min, max, clamp, reflect, normalize, etc.) 
	// and variables (gl_FragCoord, gl_Position) in the OpenGL Shading Language Specification: 
	// https://www.khronos.org/registry/OpenGL/specs/gl/GLSLangSpec.4.60.html#built-in-functions
	lightVec = normalize(lightVec);
	normalVec = normalize(normalVec);
	eyeVec = normalize(eyeVec);

	// implement phong shader
	//compute diffuse term
	
	float diffuse = max(dot(normalVec,lightVec),0.0);
	//compute specular term
	//vec3 reflectVec = vec3(0.0, 0.0, 0.0);
	vec3 reflectVec = reflect(-lightVec,normalVec);
	float spec = pow(max(dot(reflectVec,eyeVec), 0.0), material.shininess);

/*	  
  if(u_enableObjectTexture)
  {

	
  material.diffuse = textureColor;
    material.ambient = textureColor;
  }
  */
	//use term an light to compute the components
	vec4 c_amb  = clamp(light.ambient * material.ambient, 0.0, 1.0);
	vec4 c_diff = clamp(diffuse * light.diffuse * material.diffuse, 0.0, 1.0);
	vec4 c_spec = clamp(spec * light.specular * material.specular, 0.0, 1.0);
	vec4 c_em   = material.emission;
	return c_amb + c_diff + c_spec + c_em;
}
vec4 calculateTheSpotLight(SpotLight light, Material material, vec3 lightVec, vec3 directionSpotLightVec, vec3 normalVec, vec3 eyeVec)
{
	
	lightVec = normalize(lightVec);
	normalVec = normalize(normalVec);
	eyeVec = normalize(eyeVec);

	vec3 reflectVec = reflect(-lightVec,normalVec);
	float diffuse = max(dot(normalVec,lightVec),0.0);
	float theta = dot(directionSpotLightVec, lightVec);

	
	float spec = pow( max( dot(reflectVec, eyeVec), 0.0) , material.shininess);


	vec4 c_amb  = clamp(light.ambient * material.ambient, 0.0, 1.0);
	vec4 c_diff = clamp(diffuse * light.diffuse * material.diffuse, 0.0, 1.0);
	vec4 c_spec = clamp(spec * light.specular * material.specular, 0.0, 1.0);
	vec4 c_em   = material.emission;
	if(theta < cos(light.angle))
	{
		return c_amb + c_diff + c_spec + c_em;
	}
}
void main() {
	// use material uniform
	// use light uniform
	//use second light source
// vec4 textureColor = vec4(0,0,0,1); //requred in 
  vec4 textureColor = vec4(0,0,0,1);

  
  if(u_enableObjectTextureMult)
  {
   
    vec4 FirstTexture = texture2D(u_texMult, v_texCoord);
   vec4 SecondTexture  = texture2D(u_tex1, v_texCoord);
   gl_FragColor = (FirstTexture + SecondTexture );
 
	 
	
	
	return; 
  }
  
  if(u_enableObjectTexture)
  {

	
   gl_FragColor = texture2D(u_tex,v_texCoord);
   	return;
  }
/* */
	gl_FragColor = calculateSimplePointLight(u_light, u_material, v_lightVec,v_normalVec, v_eyeVec/*, textureColor */)
	+ calculateSimplePointLight(u_light2, u_material, v_light2Vec, v_normalVec, v_eyeVec/*, textureColor */)
	+ calculateSimplePointLight(u_light3, u_material, v_light3Vec, v_normalVec, v_eyeVec/*,textureColor */)
	+calculateTheSpotLight(u_light4, u_material,v_light4Vec, v_light4directionSpotLightVec, v_normalVec, v_eyeVec);
	



}
