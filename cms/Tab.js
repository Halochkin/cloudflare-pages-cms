window.makeSlug = function (el) {
  const slug = el.value.toLowerCase().replaceAll(/[^a-z_\s-]/g, "").replaceAll(/\s/g, "_");
  //todo check this slug against existing elements.
  el.form.setAttribute("action", `/set/${slug}`);
}

function makeMetabox(title, elements) {
  const metaFrame = document.createElement("div");
  metaFrame.classList.add("meta_frame");
  const metaHeader = document.createElement("div");
  metaHeader.classList.add("meta_header");
  const metaTitle = document.createElement("h2");
  metaTitle.classList.add("meta_title");
  metaTitle.textContent = title;
  const metaInput = document.createElement("div");
  metaInput.classList.add("meta_input");
  metaHeader.append(metaTitle);

  if (elements instanceof Array)
    metaInput.append(...elements)
  else
    metaInput.append(elements)


  metaFrame.append(metaHeader, metaInput);
  return metaFrame;
}

const title = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "title";
  input.pattern = "[a-zA-Z]{1}.*";
  input.setAttribute("change:do_makeslug");
  input.makeslug = () => makeSlug(input);
  input.placeholder = "Title must start with a character";
  input.after(document.createElement("br"));
  return makeMetabox("Title ", input);
}

const shortDescription = () => {
  const textarea = document.createElement("textarea");
  textarea.name = "short_text";
  textarea.placeholder = "Write several sentences here"
  textarea.size = "30";
  textarea.setAttribute("required");
  return makeMetabox("Short description", textarea);
}

const fullDescription = () => {
  const textarea = document.createElement("textarea");
  textarea.name = "full_text";
  textarea.placeholder = "Write full description here";
  textarea.rows = "10";
  textarea.size = "30";
  textarea.setAttribute("required");
  return makeMetabox("Full description", textarea);
}

const youtubeUrl = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "youtube_url";
  input.size = "80";
  input.setAttribute("required");
  return makeMetabox("Youtube url", input)
}

const producerUrl = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "producer_url";
  input.placeholder = "Producer website url";
  input.size = "30";
  input.setAttribute("required");
  return makeMetabox("Producer url", input);
}

const mainProducer = () => {
  const producers = json?.keys?.filter(post => post.metadata?.type === "producer");

  let inputs = producers?.map(post => {
    if (post.metadata?.type !== "producer") return;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "main_producer";
    input.setAttribute("value", post.name);
    input.setAttribute("change:do_changemainproducer");
    input.changemainproducer = () => {
      debugger
    }
    const label = document.createElement("label");
    label.textContent = post.metadata.title;
    label.setAttribute("for", "main_producer");
    const br = document.createElement("br")
    return [input, label, br];
  });

  return makeMetabox("Select main producer", inputs.flat());
}

const additionalProducers = () => {

  const producers = json?.keys?.filter(post => post.metadata?.type === "producer");

  const inputs = producers.map(post => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "additional_producers";
    input.setAttribute("value", post.name);
    // input.setAttribute("change:do_changeadditionalproducer");
    // input.changeadditionalproducer = () => {
    //   debugger
    // }
    const label = document.createElement("label");
    label.textContent = post.metadata.title;
    label.setAttribute("for", "additional_producers");
    label.after(document.createElement("br"));
    const br = document.createElement("br")
    return [input, label, br];
  });

  const hiddenInput = makeHiddenInput("additional_producers");
  hiddenInput.id = "additional_producers";
  inputs.push(hiddenInput);
  return makeMetabox("Select additional producers", inputs.flat());
}

const featuredImage = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.name = "image";
  return makeMetabox("Feature image", input);
}

const makeHiddenInput = (name, value) => {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  if (value)
    input.value = value;
  return input;
}

const makeSubmitBtn = () => {
  const submitBtn = document.createElement("input");
  submitBtn.type = "submit";
  submitBtn.value = "Submit";
  submitBtn.setAttribute("mousedown:do_presubmit");
  submitBtn.presubmit = preSubmit;
  return submitBtn;
}


function preSubmit(e) {

  let arr = [...document.querySelectorAll('input:checked[name=additional_producers]')].map(function (element) {
    return element.value
  });
  //set value to hidden input
  document.querySelector("input#additional_producers").value = arr.join(",");

  e.target.parentElement.submit();
}

const json = await (await fetch("/list")).json();


export class TabElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    //language=html
    this.shadowRoot.innerHTML = `
        <style>
            .sub-menu-btn {
                padding: 20px;
            }
        </style>
        <span></span>
        <slot></slot>
    `;
  }

  opensubmenu(e) {
    e.stopImmediatePropagation();
    const target = e.target;
    const submenuElement = this.firstElementChild;
    const type = this.getAttribute("type");
    const alreadyOpen = submenuElement.hasAttribute("slot");
    if (alreadyOpen) {
      submenuElement.removeAttribute("slot");
      target.textContent = "▶";
    } else {
      submenuElement.setAttribute("slot", "submenu-" + type);
      target.textContent = "▼";
    }
  }

  updateTitle(title) {
    const tabContentElement = document.querySelector("tab-content");
    const titleElement = tabContentElement.shadowRoot.querySelector("h2");
    titleElement.textContent = title;
  }

  showtab(e) {
    const btn = this;
    const data = json;
    const type = btn.getAttribute("type");
    const tabContentElement = document.querySelector("tab-content")
    const slotElement = tabContentElement.shadowRoot.querySelector("slot");
    slotElement.setAttribute("name", type);
    const formElement = document.querySelector(`form-input[slot=${type}]`);
    if (e.target === this) {
      this.clearForm(formElement);
      this.updateTitle("Add new " + type);
    }
  }

  makeFormInputElement(type) {
    const iD = Date.now();
    let metaboxes = [makeHiddenInput("id", iD), makeHiddenInput("type", type), title()];


    if (type === "video" || type === "serie")
      metaboxes.push(shortDescription(), fullDescription(), youtubeUrl(), featuredImage(), mainProducer(), additionalProducers());
    else if (type === "producer")
      metaboxes.push(producerUrl(), featuredImage());
    else if (type === "episode")
      metaboxes.push(shortDescription(), fullDescription(), youtubeUrl(), featuredImage());


    let formInputElement = document.createElement("form-input");
    const formElement = document.createElement("form");
    formElement.setAttribute("method", "POST");
    formElement.setAttribute("enctype", "multipart/form-data");
    formElement.append(...metaboxes, makeSubmitBtn());
    // formInputsElement.classList.add("form-hidden");
    formInputElement.setAttribute("slot", type);
    formInputElement.id = "form-" + type;

    formInputElement.append(formElement);


    return formInputElement;
  }

  clearForm(formElement) {
    [...formElement.querySelectorAll("[name]:not([name=type]):not([name=additional_producers]):not([name=main_producer])")]?.forEach(input => input.value = "");
  }

  editPost(e, metadata) {
    const type = metadata.type;
    const formInputElement = document.querySelector(`form-input[slot=${type}]`);
    const formElement = formInputElement.querySelector("form");

    const slug = metadata.title.toLowerCase().replaceAll(/[^a-z_\s-]/g, "").replaceAll(/\s/g, "_");
    formElement.setAttribute("action", `/set/${slug}`);
    this.updateTitle("Update " + metadata.title);
    //todo: set action to the form

    Object.keys(metadata).forEach(key => {
      const input = formInputElement.querySelector(`[name=${key}]`);

      if (key === "additional_producers" || key === "main_producer") {
        const inputs = [...formInputElement.querySelectorAll(`[name=${key}]`)];
        if (key === "main_producer")
          inputs.forEach(input => input.value === metadata[key] && input.setAttribute("checked"));
        else{
          let selectedProducers = metadata[key]?.split(",");
          if(selectedProducers.length){
            selectedProducers.forEach(producer=>
              formInputElement.querySelector(`[name=${key}][value=${producer}]`)?.setAttribute("checked"))
          }
        }
      } else if (input && key !== "image")
        input.value = metadata[key];
    });
  }

  makeMenu(type) {
    const formInputElement = this.makeFormInputElement(type);
    const tabContent = document.querySelector("#tab-content");
    const data = json;
    //todo: make error if no json.length
    let list = Object.values(data.keys).filter(post => post.metadata.type === type);
    const subMenuElement = document.createElement("div");
    subMenuElement.classList.add("sub-menu");

    // if (!list.length)

    const subMenuBtns = list?.map(post => {
      const subMenuBtn = document.createElement("div");
      subMenuBtn.setAttribute("click:do_editpost");
      subMenuBtn.classList.add("sub-menu-btn");
      subMenuBtn.textContent = post.metadata.title.charAt(0).toUpperCase() + post.metadata.title.slice(1);
      subMenuBtn.editpost = e => this.editPost(e, post.metadata);
      return subMenuBtn;
    });

    if (subMenuBtns.length) {
      subMenuElement.append(...subMenuBtns);
      this.append(subMenuElement);
      this.shadowRoot.querySelector("span").insertAdjacentHTML("afterend", "<b click:do_opensubmenu>▶</b>");
      const b = this.shadowRoot.querySelector("b");
      b.opensubmenu = this.opensubmenu.bind(this);
    }
    tabContent.append(formInputElement);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "type") return
    const type = newValue;
    const span = this.shadowRoot.querySelector("span");
    const slot = this.shadowRoot.querySelector("slot");
    span.innerText = `${type.charAt(0).toUpperCase() + type.slice(1) + "s"} `;
    slot.setAttribute("name", "submenu-" + type);
    this.makeMenu(type);
  }

  static get observedAttributes() {
    return ["type"];
  }
}

class formInputs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `<slot></slot>`;
  }
}

customElements.define("form-input", formInputs);


class tabContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
        <h2>Add or update a post</h2>
        <slot name="video"></slot>`;
  }
}

customElements.define("tab-content", tabContent)
 