function makeMetabox(title, element) {
  let res = `
    <div class="meta_frame">
     <div class="meta_header"><h2 class="meta_title">${title}</h2></div>
    <div class="meta_input">
     ${element}
    </div>
   </div>
    `;
  return res;
}





export async function onRequest({params: {post_slug}, env}) {

  const post = await env.POSTS.get(post_slug);



  const title = makeMetabox("Title ",
    `<input type="text" name="title" pattern="[a-zA-Z]{1}.*" value=${post.metadata.title}>(title must start with a  character)<br>`);


  return new Response(title, {headers: {"Content-Type": "text/html"}});


}