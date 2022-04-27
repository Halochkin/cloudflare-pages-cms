
export async function onRequestPost({request, params: {postId: slug}, env}) {


  debugger
  const json = await(await fetch("/list")).json();

  debugger


  return new Response("edit mtfckr");
}