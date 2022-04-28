[...document.querySelectorAll(".tab")].map(item => item.addEventListener("click", function () {
  const postType = this.getAttribute("type");
  if (postType === "video")
    form.innerHTML = makeHiddenInput(
      postType) + title + shortDescription + fullDescription + youtubeUrl + feturedImage + mainProducer + additionalProducers + submitBtn;
  if (postType === "episode")
    form.innerHTML = makeHiddenInput(
      postType) + title + shortDescription + fullDescription + youtubeUrl + feturedImage + submitBtn;
  if (postType === "producer")
    form.innerHTML = makeHiddenInput(postType) + title + producerUrl + feturedImage + submitBtn;
  if (postType === "serie")
    form.innerHTML = title + shortDescription + fullDescription + youtubeUrl + feturedImage + mainProducer + additionalProducers + submitBtn;
  // const txt = json.keys.map(printPost(postType)).join('\n');
}))