// Samplers
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D sceneSampler0;

// Parameters
uniform vec2 screenSize;
void main(void)
{
    vec4 orig = texture2D(sceneSampler0, vUV);
    vec4 dest = texture2D(textureSampler, vUV);
    vec4 final = orig * 1.0 + dest * 1.0;
    final.a = 1.0;
    gl_FragColor = final;
}
