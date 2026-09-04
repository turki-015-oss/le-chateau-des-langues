// User-approved removal of the generated checkerboard; preserve interior stone.
const sharp = require('sharp');
async function main() {
  const input = process.argv[2];
  const {data, info} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h} = info;
  const seen = new Uint8Array(w*h), queue = new Int32Array(w*h);
  let head=0, tail=0;
  const neutral = i => {
    const p=i*4,r=data[p],g=data[p+1],b=data[p+2];
    return Math.min(r,g,b)>215 && Math.max(r,g,b)-Math.min(r,g,b)<13;
  };
  const add = i => { if (!seen[i] && neutral(i)) {seen[i]=1;queue[tail++]=i;} };
  for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}
  for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
  while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);if(x)add(i-1);if(x<w-1)add(i+1);if(y)add(i-w);if(y<h-1)add(i+w);}
  for(let i=0;i<w*h;i++)if(seen[i])data[i*4+3]=0;
  const image=sharp(data,{raw:{width:w,height:h,channels:4}});
  await image.clone().webp({quality:95,alphaQuality:100}).toFile('public/kingdom-portal-assets/university-campus-front-v3.webp');
  await image.clone().flatten({background:'#d9e2c5'}).png().toFile(process.argv[3]);
  console.log({width:w,height:h,transparentPixels:tail,total:w*h});
}
main().catch(e=>{console.error(e);process.exit(1)});
