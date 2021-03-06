//http://dept-info.labri.fr/~schlick/DOC/gem2.ps.gz

uniform sampler2D textureSampler;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform vec2 screenSize;
varying vec2 vUV;

uniform float time;

float bias(float x, float b) {
	return  x/((1./b-2.)*(1.-x)+1.);
}

float gain(float x, float g) {
	float t = (1./g-2.)*(1.-(2.*x));
	return x<0.5 ? (x/(t+1.)) : (t-x)/(t-1.);
}

vec3 degamma(vec3 c)
{
	return pow(c,vec3(2.2));
}
vec3 gamma(vec3 c)
{
	return pow(c,vec3(1./1.6));
}

#define pi 3.1415927

void main()
{
	vec2 uv = vUV;
	//uv.y=1.-uv.y;
	//uv.x *= screenSize.x / screenSize.y;
    uv.x -= 0.65;
    //uv.x *= 0.5;

	float h = 0.;

#define DIVS	8

	for (int iy=0; iy<DIVS; iy++)
	{
		for (int ix=0; ix<DIVS*2; ix++)
		{
			//random variations for droplet
			vec4 t = texture2D(iChannel1,(4./256.)*vec2(float(ix),float(iy)),-100.);


			//stratify droplet positions
			vec2 p = vec2(ix,iy)*(1./float(DIVS-1));
			p += (0.75/float(DIVS-1))*(t.xy*2.-1.);
            p.x -= 0.65;

			//radius
			vec2 v = uv-p;//+0.65;
			float d = dot(v,v);
			d = pow(d,.7);
			float life = 10.;

			float n = time*5.*(t.w+0.2) - t.z*6.;
			n *= 0.1+ t.w;
			n = mod(n,life+t.z*3.+10.);				//repeat, plus a pause
			float x = d*99.;
			float T = x<(2.*pi*n) ? 1. : 0.;	//clip to 0 after end
			float e = max(1. - (n/life),0.);		//entirely fade out by now
			float F = e*x/(2.*pi*n);				//leading edge stronger and decay

			float s = sin(x-(2.*pi*n)-pi*0.5);

			s = s*0.5+0.5;		//bias needs [0,1]
			s = bias(s,.6);	//shape the ripple profile


			s = (F*s)/(x+1.1)*T;

			h+=s*100.*(0.5+t.w);

		}
	}


	vec3 n = vec3(dFdx(h),17.,dFdy(h));
	n = normalize(n);

	vec3 E = normalize(vec3(-uv.y*2.-1.,1.,uv.x*2.-1.));	//fake up an eye vector
	vec3 rv = reflect(-E,n);
	vec3 reflect_color = degamma(texture2D(iChannel2,rv.xy).xyz);
    //vec3 reflect_color = texture2D(iChannel2, rv).xyz;

	vec3 fn = refract(vec3(0,1,0),n,2.5);
	uv += fn.xz*0.1;

	float lod = length(fn.xz)*10.;

	vec3 c = vec3(0.);
	c += degamma(texture2D(textureSampler,uv+vec2(0.66,0.),lod).xyz);
	c *= 1.-h*0.0125;
	c += reflect_color*.3;

//	fragColor = vec4(h*0.5+0.5);
//	fragColor = vec4(n*0.5+0.5,1.);
	vec3 L = normalize(vec3(1,1,1));
	float dl = max(dot(n,L),0.)*.7+.3;
	c *= dl;
//	fragColor = vec4(vec3(dl),1.);

	c = gamma(c);
	gl_FragColor = vec4(vec3(c),1.);
}
