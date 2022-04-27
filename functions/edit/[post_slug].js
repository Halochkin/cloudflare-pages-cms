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

  const metadata = JSON.parse(post);
  const post_type = metadata.type;


  const title = makeMetabox("Title ",
    `<input type="text" name="title" pattern="[a-zA-Z]{1}.*" value=${metadata.title}>(title must start with a  character)<br>`);

  const shortDescription = makeMetabox("Short description",
    `<textarea placeholder="Write several sentences here" type="text" name="short-text" size="30" required value=${metadata.short_text}></textarea>`);

  // if(post_type === "video")

  return new Response(title + shortDescription, {headers: {"Content-Type": "text/html"}});


}