
export async function onRequestPost({request, params: {postId: slug}, env}) {


  debugger
  const json = await(await fetch("/list")).json();

  debugger

  const formData = await FormDataPolyfish(request);
  await saveFile(slug, formData, "image", env, "IMG");
  console.log(slug, "is ready to set")
  await env.POSTS.put(slug, JSON.stringify(formData), {metadata: {...formData, timestamp: Date.now()}});
  return new Response(JSON.stringify(formData));
}