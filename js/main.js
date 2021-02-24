
let capture,
    guideHeaderStartBtn,
    confirmOKBtn,
    confirmCancelBtn,
    kakaoShareBtn,
    kakaoShareCancel,
    kakaoShareOK,
    writeCommentBtn,
    addEmoticonBtn,
    commentBoxCancelBtn,
    commentBoxOKBtn,
    undoEmojiBtn,
    deleteBtn,
    removeCancelBtn,
    removeOKBtn;

let commentInput,
    commentBox,
    commentDiv,
    shareMessage,
    navMessage,
    contentWrapper,
    emojiSection,
    navGuide;

let editObject = null;
let commentsIndex = 0;
let confirmBoxIndex = "";
let renderItems = [];
let shareObjectId;

// Template : JSON type which save renderable item's position, rotation, scale and imageUrl.
const commentTemplate= {
  "id": null,
  "type": null,
  "content": null,
  "position": {
    "_x": null,
    "_y": null,
    "_z": null
  },
  "rotation": {
    "_x": null,
    "_y": null,
    "_z": null
  },
  "scale": {
    "_x": null,
    "_y": null,
    "_z": null
  }
};

let commentObject = {...commentTemplate};
// let helpObject = {...commentTemplate};

// TODO: At the moment, parse Server error
/*axios.defaults.baseURL = 'https://browser.letsee.io:8337/parse';
axios.defaults.headers.common['X-Parse-Application-Id'] = 'awe2019wallboard';*/

/**
 * When users clicks 'Cancel' button in message box.
 */
function cancelCommentBox() {
  contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
  document.getElementById('nav').style.display = 'block';
  writeCommentBtn.style.display = 'block';
  document.getElementById('nav-emo').style.display = 'block';
  commentBox.style.display = 'none';
}

/**
 * Kakao sharing
 */
function openKakaoModal() {
  contentWrapper.style.background = 'rgba(0, 0, 0, .8)';
  document.getElementById('nav').style.display = 'none';
  document.getElementById('kakao-modal-box').style.display = 'flex';
}

/**
 * Open the dialog to delete all messages
 */
function openRemoveModal() {
  navMessage.style.display = 'none';
  contentWrapper.style.background = 'rgba(0, 0, 0, .8)';

  document.getElementById('remove-modal-box').style.display = 'block';
  document.getElementById('nav').style.display = 'none';
}

/**
 * User adds comments by clicking on 저장 button.
 */
function addComments() {
  let cmt_content = commentInput.value;
  let content_bytes = getBytesString(cmt_content.toString());

  if (content_bytes > 30 || content_bytes === 0 || cmt_content === '') {
    commentInput.style.border = '1px solid red';
    window.alert("내용을 15자 이내로 간단하게 남겨주세요!");
    return;
  }

  if (cmt_content.toString().length <= 30 ) {
    // Open the confirm panel, so that users can update the position and orientation
    commentBox.style.display = 'none';
    document.getElementById('confirm').style.display = 'block';
    contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
    navMessage.style.display = 'none';

    /*let str_count = cmt_content.toString().length;
    let helpDiv = createHelpDiv('comment', str_count);
    const help = createHelpRenderable(helpDiv);
    world.add(help);*/

    const type = 'comment';
    const div = createCommentDiv(cmt_content);
    const commentRenderable = createCommentRenderable(div, type);
    commentRenderable.element.classList.add('renderable', 'helper');
  }

  // reset input and close the confirm panel
  commentInput.value = '';
}

/**
 * Create comment div element for text message.
 * @param comment
 * @returns {string}
 */
function createCommentDiv(comment) {
  return `<div class="wrap"><div class="comment"><div class="value">${comment}</div></div></div>`;
}

/**
 * Add emoji when users click on each emoticon.
 * @param i
 */
function addEmoji(i) {
  emojiSection.style.display = 'none';
  undoEmojiBtn.style.display = 'none';

  document.getElementById('confirm').style.display = 'block';
  undoEmojiBtn.style.display = 'none';

  /*let helpDiv = createHelpDiv('emoji');
  const help = createHelpRenderable(helpDiv);
  world.add(help);*/

  const type = 'emoji';
  const div = `<div class="wrap"><div class="emoji"><div class="value">${i}</div></div></div>`;

  const emojiRenderable = createCommentRenderable(div, type);
  emojiRenderable.element.classList.add('renderable', 'helper');

  confirmBoxIndex = "emoji";
}

/**
 * Function to make renderable item and renderable item's position, rotation, scale.
 * @param value
 * @param _position
 * @param _rotation
 * @param _scale
 * @returns {*}
 */
function createDOMRenderable(value, _position = null, _rotation = null, _scale = null) {
  let element = document.createElement('div');
  element.innerHTML = value;

  return letsee.addXRElement(element.innerHTML, letsee.getEntityByUri('sticker.json'));
}

/**
 * Create domRenderable for text message.
 * @param _value
 * @param _type
 * @returns {*}
 */
function createCommentRenderable(_value, _type) {
  let position = [0, 0, (-3 * commentsIndex) - 15];

  commentsIndex++;

  let rotation = [0, 0, 0];
  let scale = [1, 1, 1];
  let renderable = null;
  let uid = UUID();

  let type = _type;
  if (type !== "comment" && type !== "emoji") {
    type = null
  }

  renderable = createDOMRenderable(`<div data-id="${uid}" data-type="${type}">${_value}</div>`, position, rotation, scale);
  renderable.comment_type = type;
  editObject = renderable;

  return renderable;
}

/*function createHelpDiv(type, str_count) {
  let helpDiv;
  if(type === "comment") {
    let width = 50 + str_count * 17;
    helpDiv =  `<div id="content-helper" style="width:${width}px; height:50px; margin-top: 6px; position:relative">
											<div style="width:100%; height:50%;">
												<div style="float:left;"><img  src="assets/images/icons/outline-top-left.png"></div>
												<div style="float:right;"><img  src="assets/images/icons/outline-top-right.png"></div>
											</div>
											<div style="width:100%; height:50%; padding-top: 10px">
												<div style="float:left; padding-top: 10px "><img src="assets/images/icons/outline-bottom-left.png"></div>
												<div style="float:right; padding-top: 10px"><img src="assets/images/icons/outline-bottom-right.png"></div>
											</div>
									</div>`;

  } else if (type === "emoji") {
    helpDiv = `<div id="content-helper" style="width:60px; height:70px; margin-top: 5px; position:relative">
											<div style="width:100%; height:50%;">
												<div style="float:left;"><img  src="assets/images/icons/outline-top-left.png"></div>
												<div style="float:right;"><img  src="assets/images/icons/outline-top-right.png"></div>
											</div>
											<div style="width:100%; height:50%;padding-top:15px">
												<div style="float:left; "><img src="assets/images/icons/outline-bottom-left.png"></div>
												<div style="float:right;"><img src="assets/images/icons/outline-bottom-right.png"></div>
											</div>
									</div>`;
  } else  {
    helpDiv = "";
  }

  return helpDiv;
}*/

/*function createHelpRenderable(_value) {
  let position = [0, 0, (-3 * commentsIndex) - 15];
  let rotation = [0, 0, 0];
  let scale = [1, 1, 1];
  let renderable = null;
  let uid = UUID();

  renderable = createDOMRenderable(`<div data-id="${uid}" data-type="help">${_value}</div>`, position, rotation, scale);
  helpObject = renderable;

  return renderable;
}*/

/**
 * Get random uuid
 * @returns {string}
 * @constructor
 */
function UUID() {
  let d = new Date().getTime();

  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;

    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Function to get bytes by strings
 * @param str
 * @returns {number}
 */
function getBytesString(str) {
  var len = 0;

  for (var i=0; i<str.length; i++)
  {
    var n = str.charCodeAt(i);
    if ((n>= 0) && (n<256))
      len ++;
    else len += 2; // 한글이면 2byte로 계산한다.
  }
  return len;
}

/**
 * TODO: Backup for later use.
 * @param objectId
 */
/*function resetKakaoDefaultButtonUrl(objectId) {
  Kakao.Link.createDefaultButton({
    container: '#kakao-link',
    objectType: 'feed',
    content: {
      title: '렛시 증강현실 Galaxy',
      description: '#Letsee #증강현실 #AR #이모지 #댓글 #Galaxy',
      imageUrl: 'https://image.rocketpunch.com/company/15466/ressi_logo_1457667119.jpg?s=400x400&t=inside',
      link: {
        mobileWebUrl: `https://browser.letsee.io/clab-galaxy/index.html?${objectId}`,
        webUrl: `https://browser.letsee.io/clab-galaxy/index.html?${objectId}`
      }
    },
    social: {
      likeCount: 286,
      commentCount: 45,
      sharedCount: 845
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          mobileWebUrl: `https://browser.letsee.io/clab-galaxy/index.html?${objectId}`,
          webUrl: `https://browser.letsee.io/clab-galaxy/index.html?${objectId}`
        }
      }
    ]
  });
}*/

/**
 * Function to make renderable and add to world using json data
 * TODO: Backup for later use.
 * @param data
 */
/*function printCommentItemsFromJson(data) {
  data.forEach(function (item, index) {
    let position = [item.position._x, item.position._y, (index * -3) - 15];
    let rotation = [item.rotation._x, item.rotation._y, item.rotation._z];
    let scale = [item.scale._x, item.scale._y, item.scale._z];
    let renderableItem = createDOMRenderable(item.content, position, rotation, scale);
    renderItems.push(renderableItem);
  });
}*/

/**
 * get comments json array from parse server
 * TODO: Backup for later use.
 * @param objectId
 * @returns {Promise<unknown>}
 */
/*function getShareCommentsByObjectId(objectId) {
  return new Promise((resolve, reject) => {
    axios.get(`classes/galaxy_share_comments/${objectId}`)
    .then(result => {
      resolve(result);
      editObject = null;
      printCommentItemsFromJson(result.data.comments)
    })
    .catch(error => {
      reject(error);
    })
  })
}*/

/**
 * Share messages by Kakao
 * TODO: Backup for later use
 */
/*function kakaoCommentShare() {
  postShareComments(renderItems)
  .then(() => {
    resetKakaoDefaultButtonUrl(shareObjectId);
    $("#kakao-link").trigger('click');
  });
}*/

/**
 * Post renderables json array to server.
 * TODO: Backup for later use
 * @param commentRenderables
 * @returns {Promise<unknown>}
 */
/*function postShareComments(commentRenderables) {
  return new Promise((resolve, reject) => {
    // 배열이 아니거나 null 이면 리턴
    if(!Array.isArray(commentRenderables) || commentRenderables === null)
      return;

    let commentObjectsArray = [];
    commentRenderables.forEach(function(item) {
      let commentObject = makeCommentObject(item);
      commentObjectsArray.push(commentObject);
    });

    axios.post('classes/galaxy_share_comments', {comments: commentObjectsArray})
    .then((result) => {
      resolve(result);
      shareObjectId = result.data.objectId;
    })
    .catch(error => {
      reject(error);
    })
  })
}*/

/**
 * TODO: Backup for later use.
 * @param renderable
 * @returns {{rotation: {_x: null, _y: null, _z: null}, scale: {_x: null, _y: null, _z: null}, id: null, position: {_x: null, _y: null, _z: null}, type: null, content: null}}
 */
/*function makeCommentObject(renderable) {
  commentObject = {...commentTemplate};
  commentObject.type = renderable;

  commentObject.position = {
    "_x": renderable.position.x,
    "_y": renderable.position.y,
    "_z": renderable.position.z
  };

  commentObject.rotation = {
    "_x": renderable.rotation.x,
    "_y": renderable.rotation.y,
    "_z": renderable.rotation.z
  };

  commentObject.scale = {
    "_x": renderable.scale.x,
    "_y": renderable.scale.y,
    "_z": renderable.scale.z
  };

  let $commentDiv = $(`${renderable.element.innerHTML}`);
  commentObject.id = $commentDiv.attr('data-id');
  commentObject.type = $commentDiv.attr('data-type');
  commentObject.content = $commentDiv[0].outerHTML;

  return commentObject;
}*/

/**
 * Get data (comments & emotions) from server.
 * TODO: Backup for later use.
 * @returns {Promise<unknown>}
 */
/*function getComments() {
  return new Promise((resolve, reject) => {
    axios.get('classes/docent_comments', {
      params: {
        order: '-createdAt'
      }
    })
    .then(data => {
      printCommentItemsFromJson(data.data.results);
      editObject = null;
    })
    .catch(error => {
      reject(error);
    })
  })
}*/

/**
 * TODO: Backup for later use.
 */
/*$(document).ready(function() {
  if (window.location.search.substr(1) === "") {
    // 저작 페이지
  } else {
    // 공유 페이지
    commentDiv.style.display = 'none';
    shareObjectId = window.location.search.substr(1);
    getShareCommentsByObjectId(shareObjectId);
    //const param = "aaa";// get parameter from url
    var agent = navigator.userAgent.toLowerCase();

    if (agent.indexOf("kakao") > -1) {
      console.log("카카오 브라우저입니다.");
      window.location.href = `intent://browser.letsee.io/clab-galaxy/index.html?${shareObjectId}#Intent;scheme=http;package=com.android.chrome;end`;
    } else {
      console.log("크롬 브라우저입니다.");
    }
  }

  // initialize kakao.
  Kakao.init('3acf383e8ccdb7b906df497c249ea01b');

});*/

/**
 * Confirm message with OK or Cancel buttons.
 * @param type
 */
function confirmMessage(type) {
  switch (type) {
    case 'ok':
      editObject.element.classList.remove('helper');

      emojiSection.style.display = 'none';
      document.getElementById('nav').style.display = 'block';
      undoEmojiBtn.style.display = 'none';
      document.getElementById('confirm').style.display = 'none';
      kakaoShareBtn.style.display = 'block';
      document.getElementById('guide-share-arrow').style.display = 'block';
      document.getElementById('guide-share-text').style.display = 'block';

      if(editObject !== null) {
        renderItems.push(editObject);
        editObject = null;
        commentsIndex ++;
      }

      /*if(helpObject !== null) {
        // world.remove(helpObject);
        helpObject = {...commentTemplate};
      }*/

      break;
    case 'cancel':

      emojiSection.style.display = 'none';
      document.getElementById('nav').style.display = 'block';
      undoEmojiBtn.style.display = 'none';
      document.getElementById('confirm').style.display = 'none';

      // Remove xrelement our of Entity
      letsee.getEntityByUri("sticker.json").children.pop();

      // Remove xrelement our of DOM
      let elem = document.querySelector(".helper");
      elem.parentNode.removeChild(elem);

      break;
  }
}

/**
 * Control the message box when users type the text message.
 * @param type
 */
function messageBoxControl(type) {
  switch (type) {
    case 'ok': addComments(); break;
    case 'cancel': cancelCommentBox(); break;
  }
}

/**
 * Called when users start to write comments or add emoji.
 * @param type
 */
function writeComments(type) {

  // reset dimmy background
  contentWrapper.style.background = 'rgba(0, 0, 0, 0.8)';

  // hide guide message
  navMessage.style.display = 'none';

  document.getElementById('nav').style.display = 'none';

  switch (type) {
    case 'text':
      commentBox.style.display = 'block';

      // reset input and close the confirm panel
      commentInput.value = '';
      $('#comment-box-content').focus();

      emojiSection.style.display = 'none';

      break;
    case 'emoji':
      contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
      emojiSection.style.display = 'block';
      undoEmojiBtn.style.display = "block";
      break;
  }

}

/**
 * Undo Emoji
 */
function undoEmoji() {
  emojiSection.style.display = 'none';
  undoEmojiBtn.style.display = 'none';

  document.getElementById('nav').style.display = 'block';
  document.getElementById('confirm').style.display = 'none';
}

/**
 * Remove all xr elements out of Entity and HTML DOM.
 */
function removeAllRenderables() {

  // Remove all xrelement our of Entity
  letsee.getEntityByUri("sticker.json").children = [];

  // Remove all xrelement our of DOM
  let xrElements = document.getElementsByClassName('renderable');
  if (xrElements.length > 0) {

    let parentNode = xrElements[0].parentNode;

    for(let i=0; i< xrElements.length; i++) {
      // console.warn(xrElements[i]);
      parentNode.removeChild(xrElements[i]);
    }

    // Remove the last item
    let elem = document.querySelector(".renderable");
    if (elem) elem.parentNode.removeChild(elem);
  }
}

/**
 * Show main contain when Engine starts.
 */
function showMainContent(){
  capture.style.display = 'none';

  // Disable button at the first time
  deleteBtn.removeEventListener('click', openRemoveModal);
  kakaoShareBtn.removeEventListener('click', openKakaoModal);
  writeCommentBtn.removeEventListener('click', () => writeComments('text') );
  addEmoticonBtn.removeEventListener('click', () => writeComments('emoji') );

  if(window.location.search.substr(1) === "") {
    commentDiv.style.display = 'block';
  } else {
    shareMessage.style.display = 'block';
  }
}

window.onload = () => {

  // nav
  commentDiv = document.getElementById('comment-div');
  shareMessage = document.getElementById('share-message');
  navMessage = document.getElementById('nav-message');
  contentWrapper = document.getElementById('content-wrapper');
  emojiSection = document.getElementById('ft-functions');
  navGuide = document.getElementById('nav-guide');

  // input, form, box
  commentBox = document.getElementById('comment-box');
  commentInput = document.getElementById('comment-box-content');

  // buttons
  capture = document.getElementById('capture');
  guideHeaderStartBtn = document.getElementById('guide-header-btn-start');
  writeCommentBtn = document.getElementById('nav-text');
  addEmoticonBtn = document.getElementById('nav-emo');
  kakaoShareBtn = document.getElementById('nav-kakao');
  kakaoShareCancel = document.getElementById('kakao-modal-footer-cancel');
  kakaoShareOK = document.getElementById('kakao-modal-footer-ok');
  confirmOKBtn = document.getElementById('confirm-button-ok');
  confirmCancelBtn = document.getElementById('confirm-button-cancel');
  commentBoxCancelBtn = document.getElementById('btCancel-box');
  commentBoxOKBtn = document.getElementById('btOK-box');
  undoEmojiBtn = document.getElementById('undo');
  deleteBtn = document.getElementById('nav-garbage');
  removeCancelBtn = document.getElementById('remove-modal-footer-cancel');
  removeOKBtn = document.getElementById('remove-modal-footer-ok');

  // Initialize emoji list
  for(let i = 0; i < emojiArray.length; i++){
    let testBtn = document.createElement('button');
    testBtn.classList.add('emojiBtn');
    testBtn.innerHTML = '<span onclick="addEmoji(\''+emojiArray[i]+'\')">'+emojiArray[i]+'</span>';
    document.querySelector('.emoji-box-item').appendChild(testBtn);
  }

  guideHeaderStartBtn.addEventListener('click', function() {
    navGuide.style.display = 'none';
    kakaoShareBtn.style.display = 'none';
    document.getElementById('guide-bg').style.display = 'none';
    navMessage.style.display = 'block';

    // Enable button at the first time
    deleteBtn.addEventListener('click', openRemoveModal);
    kakaoShareBtn.addEventListener('click', openKakaoModal);
    writeCommentBtn.addEventListener('click', () => writeComments('text') );
    addEmoticonBtn.addEventListener('click', () => writeComments('emoji') );
  });

  kakaoShareCancel.addEventListener('click', function() {
    contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
    document.getElementById('kakao-modal-box').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
  });
  kakaoShareOK.addEventListener('click', function() {
    contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
    // kakaoCommentShare();
    document.getElementById('nav').style.display = 'block';
    document.getElementById('kakao-modal-box').style.display = 'none';
  });

  removeCancelBtn.addEventListener('click', function() {
    contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
    document.getElementById('remove-modal-box').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
  });
  removeOKBtn.addEventListener('click', function() {

    contentWrapper.style.background = 'rgba(0, 0, 0, 0)';
    document.getElementById('remove-modal-box').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
    kakaoShareBtn.style.display = 'none';
    document.getElementById('guide-share-arrow').style.display = 'none';
    document.getElementById('guide-share-text').style.display = 'none';

    removeAllRenderables();
  });


  undoEmojiBtn.addEventListener("click", undoEmoji);

  commentBoxOKBtn.addEventListener('click', () => messageBoxControl('ok'));
  commentBoxCancelBtn.addEventListener('click', () => messageBoxControl('cancel'));

  confirmOKBtn.addEventListener('click', () => confirmMessage('ok') );
  confirmCancelBtn.addEventListener('click', () => confirmMessage('cancel') );

}