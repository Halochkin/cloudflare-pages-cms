
const template = `
<script>
  const form = document.querySelector("form");

  window.makeSlug = function (el) {
    const slug = el.value.toLowerCase().replaceAll(/[^a-z_\\s-]/g, "").replaceAll(/\\s/g, "_");
    //todo check this slug against existing elements.
    el.form.setAttribute("action", \`/set/${slug}\`);
  }

  function makeMetabox(title, element) {
    let res = \`
    <div class="meta_frame">
     <div class="meta_header"><h2 class="meta_title">${title}</h2></div>
    <div class="meta_input">
     ${element}
    </div>
   </div>
    \`;
    return res;
  }

 const title = makeMetabox("Title ",
    \`<input type="text" name="title" pattern="[a-zA-Z]{1}.*" onChange="makeSlug(this)">(title must start with a  character)<br>\`);

[...document.querySelectorAll(".post_item")].map(item => item.addEventListener("click", function () {
  const postType = this.getAttribute("type");
  if (postType === "video")
    form.innerHTML =  title ;

}))
</script>`



export async function onRequest({env: {POSTS}}) {
  return new Response(template, {headers: {"Content-Type": "text/plain"}});
}