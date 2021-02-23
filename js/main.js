
let capture,
    guideHeaderStartBtn;

let commentDiv, shareMessage;

// THIS SCRIPT FOR COMMENT.HTML PAGE
let editObject = null;
let CURRENT_URI = null;
let currentTarget = null;
// const world = new Object3D();

// count comments.
let commentsIndex = 0;
let confirmBoxIndex = "";
let renderItems = [];

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
let helpObject = {...commentTemplate};

$(document).ready(function() {
  initBtnEvent();

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

  var emojiArray =[
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '☺️', '😊',
    '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚',
    '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤡', '🤠',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦',
    '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥',
    '🤤', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤥', '😬', '🤐',
    '🤢', '🤧', '😷', '🤒', '🤕', '❤️', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞',
    '💓', '💗', '💖', '💘', '💝', '😈', '👿', '👹', '👺', '💩',
    '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹',
    '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏',
    '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤘',
    '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖',
    '👋', '🤙', '💪', '🖕', '✍️', '🤳', '💅', '🖖', '💄', '💋',
    '👄', '👅', '👂', '👃', '👣', '👁', '👀', '🗣', '👤', '👥',
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈',
    '🍒', '🍑', '🍍', '🥝', '🥑', '🍅', '🍆', '🥒', '🥕', '🌽',
    '🌶', '🥔', '🍠', '🌰', '🥜', '🍯', '🥐', '🍞', '🥖', '🧀',
    '🥚', '🍳', '🥓', '🥞', '🍤', '🍗', '🍖', '🍕', '🌭', '🍔',
    '🍟', '🥙', '🌮', '🌯', '🥗', '🥘', '🍝', '🍜', '🍲', '🍥',
    '🍣', '🍱', '🍛', '🍚', '🍙', '🍘', '🍢', '🍡', '🍧', '🍨',
    '🍦', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪',
    '🥛', '🍼', '☕️', '🍵', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃',
    '🍸', '🍹', '🍾', '🥄', '🍴', '🍽',
    '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑',
    '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🌛', '🌜', '🌙', '💫',
    '⭐️', '🌟', '✨', '⚡️', '🔥', '💥', '☄️', '☀️', '🌤', '⛅️',
    '🌥', '🌦', '🌈', '☁️', '🌧', '⛈', '🌩', '🌨', '☃️', '⛄️',
    '❄️', '🌬', '💨', '🌪', '🌫', '🌊', '💧', '💦', '☔️',
    '👶', '👦', '👧', '👨', '👩', '👱‍♀️', '👱', '👴', '👵', '👲',
    '👳‍♀️', '👳', '👮‍♀️', '👮', '👷‍♀️', '👷', '💂‍♀️', '💂', '🕵️‍♀️', '🕵️',
    '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤',
    '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧',
    '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀',
    '👩‍⚖️', '👨‍⚖️', '🤶', '🎅', '👸', '🤴', '👰', '🤵', '👼', '🤰',
    '🙇‍♀️', '🙇', '💁', '💁‍♂️', '🙅', '🙅‍♂️', '🙆', '🙆‍♂️', '🙋', '🙋‍♂️',
    '🤦‍♀️', '🤦‍♂️', '🤷‍♀️', '🤷‍♂️', '🙎', '🙎‍♂️', '🙍', '🙍‍♂️', '💇', '💇‍♂️',
    '💆', '💆‍♂️', '🕴', '💃', '🕺', '👯', '👯‍♂️', '🚶‍♀️', '🚶', '🏃‍♀️',
    '🏃', '👫', '👭', '👬', '💑', '👩‍❤️‍👩', '👨‍❤️‍👨', '💏', '👩‍❤️‍💋‍👩', '👨‍❤️‍💋‍👨',
    '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧',
    '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧',
    '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '👚', '👕', '👖', '👔', '👗',
    '👙', '👘', '👠', '👡', '👢', '👞', '👟', '👒', '🎩', '🎓',
    '👑', '⛑', '🎒', '👝', '👛', '👜', '💼', '👓', '🕶', '🌂',
    '☂️', '🎀', '🎊', '🎉',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙊', '🙉', '🐒',
    '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
    '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐚', '🐞',
    '🐜', '🕷', '🕸', '🐢', '🐍', '🦎', '🦂', '🦀', '🦑', '🐙',
    '🦐', '🐠', '🐟', '🐡', '🐬', '🦈', '🐳', '🐋', '🐊', '🐆',
    '🐅', '🐃', '🐂', '🐄', '🦌', '🐪', '🐫', '🐘', '🦏', '🦍',
    '🐎', '🐖', '🐐', '🐏', '🐑', '🐕', '🐩', '🐈', '🐓', '🦃',
    '🕊', '🐇', '🐁', '🐀', '🐿', '🐾', '🐉', '🐲', '🌵', '🎄',
    '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃',
    '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌻', '🌼',
    '🌸', '🌺',
    '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸',
    '🥅', '🏒', '🏑', '🏏', '⛳️', '🏹', '🎣', '🥊', '🥋', '⛸',
    '🎿', '⛷', '🏂', '🏋️‍♀️', '🏋️', '🤺', '🤼‍♀️', '🤼‍♂️', '🤸‍♀️', '🤸‍♂️',
    '⛹️‍♀️', '⛹️', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏄‍♀️', '🏄', '🏊‍♀️', '🏊',
    '🤽‍♀️', '🤽‍♂️', '🚣‍♀️', '🚣', '🏇', '🚴‍♀️', '🚴', '🚵‍♀️', '🚵', '🎽',
    '🏅', '🎖', '🥇', '🥈', '🥉', '🏆', '🏵', '🎗', '🎫', '🎟',
    '🎪', '🤹‍♀️', '🤹‍♂️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹',
    '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '🎯', '🎳', '🎮', '🎰',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐',
    '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🚨', '🚔', '🚍',
    '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄',
    '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '🚁', '🛩', '✈️',
    '🛫', '🛬', '🚀', '🛰', '💺', '🛶', '⛵️', '🛥', '🚤', '🛳',
    '⛴', '🚢', '⚓️', '🚧', '⛽️', '🚏', '🚦', '🚥', '🗺', '🗿',
    '🗽', '⛲️', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🎠', '⛱',
    '🏖', '🏝', '⛰', '🏔', '🗻', '🌋', '🏜', '🏕', '⛺️', '🛤',
    '🛣', '🏗', '🏭', '🏠', '🏡', '🏘', '🏚', '🏢', '🏬', '🏣',
    '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪️',
    '🕌', '🕍', '🕋', '⛩', '🗾', '🎑', '🏞', '🌅', '🌄', '🌠',
    '🎇', '🎆', '🌇', '🌆', '🏙', '🌃', '🌌', '🌉', '🌁',
    '⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹',
    '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
    '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚',
    '🎛', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋', '🔌',
    '💡', '🔦', '🕯', '🗑', '🛢', '💸', '💵', '💴', '💶', '💷',
    '💰', '💳', '💎', '⚖️', '🔧', '🔨', '⚒', '🛠', '⛏', '🔩',
    '⚙️', '⛓', '🔫', '💣', '🔪', '🗡', '⚔️', '🛡', '🚬', '⚰️',
    '⚱️', '🏺', '🔮', '📿', '💈', '⚗️', '🔭', '🔬', '🕳', '💊',
    '💉', '🌡', '🚽', '🚰', '🚿', '🛁', '🛀', '🛎', '🔑', '🗝',
    '🚪', '🛋', '🛏', '🛌', '🖼', '🛍', '🛒', '🎁', '🎈', '🎏',
    '🎎', '🏮', '🎐', '✉️', '📩', '📨', '📧',
    '💌', '📥', '📤', '📦', '🏷', '📪', '📫', '📬', '📭', '📮',
    '📯', '📜', '📃', '📄', '📑', '📊', '📈', '📉', '🗒', '🗓',
    '📆', '📅', '📇', '🗃', '🗳', '🗄', '📋', '📁', '📂', '🗂',
    '🗞', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚',
    '📖', '🔖', '🔗', '📎', '🖇', '📐', '📏', '📌', '📍',
    '🎌', '🏳️', '🏴', '🏁', '✂️', '🖊', '🖋', '✒️', '🖌',
    '🖍', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓',
    '💟', '☮️', '✝️', '☪️', '🕉',
    '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️',
    '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️',
    '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚️', '🈸',
    '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵',
    '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️',
    '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳',
    '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️',
    '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅',
    '🈯️', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤',
    '🏧', '🚾', '♿️', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅',
    '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️',
    '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', // 0
    '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', // 1, 2, 3, 4, 5, 6, 7, 8, 9
    '🔢', '#️⃣', '*️⃣', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮',
    '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️',
    '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️',
    '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖',
    '➗', '✖️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿',
    '🔚', '🔙', '🔛', '🔝', '✔️', '☑️', '🔘', '⚪️', '⚫️', '🔴',
    '🔵', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️',
    '▫️', '◾️', '◽️', '◼️', '◻️', '⬛️', '⬜️', '🔈', '🔇', '🔉',
    '🔊', '🔔', '🔕', '📣', '📢', '👁‍🗨', '💬', '💭', '🗯', '♠️',
    '♣️', '♥️', '♦️', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓',
    '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝',
    '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧',
    '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸',
    '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹',
    '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲',
    '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫',
    '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇮🇨', '🇨🇻', '🇧🇶', '🇰🇾', '🇨🇫', '🇹🇩',
    '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷',
    '🇨🇮', '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴',
    '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇪🇺', '🇫🇰', '🇫🇴',
    '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪',
    '🇬🇭', '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳',
    '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷',
    '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇯🇲', '🇯🇵', '🎌', '🇯🇪', '🇯🇴',
    '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸',
    '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾',
    '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲',
    '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷',
    '🇳🇵', '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇰🇵',
    '🇲🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪',
    '🇵🇭', '🇵🇳', '🇵🇱', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼',
    '🇼🇸', '🇸🇲', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇰',
    '🇸🇮', '🇬🇸', '🇸🇧', '🇸🇴', '🇿🇦', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰', '🇧🇱',
    '🇸🇭', '🇰🇳', '🇱🇨', '🇵🇲', '🇻🇨', '🇸🇩', '🇸🇷', '🇸🇿', '🇸🇪', '🇨🇭',
    '🇸🇾', '🇹🇼', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹',
    '🇹🇳', '🇹🇷', '🇹🇲', '🇹🇨', '🇹🇻', '🇻🇮', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧',
    '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇦', '🇻🇪', '🇻🇳', '🇼🇫', '🇪🇭', '🇾🇪',
    '🇿🇲', '🇿🇼',
  ];
  // for(var i = emojiArray.length; i--;){
  for(var i = 0; i < emojiArray.length; i++){
    var span = document.createElement('span');
    span.innerHTML = '<span onclick="addEmoji(\''+emojiArray[i]+'\');">'+emojiArray[i]+'</span>';
    document.querySelector('.emoji-box-item').appendChild(span);
  }

});

$('#comment-box-content').focusout(function (e) {
  $('#comment-box-nickname').focus();
});

function finishComment() {
  document.getElementById('comment-success').style.display = 'none';
  document.getElementById('nav-text').style.display = 'block';
  document.getElementById('nav-emo').style.display = 'block';
}

function cancelCommentBox() {
  document.getElementById('nav').style.display = 'block';
  document.getElementById('nav-text').style.display = 'block';
  document.getElementById('nav-emo').style.display = 'block';
  document.getElementById('comment-box').style.display = 'none';
  // world.remove(editObject);
}

function openKakaoModal() {
  document.getElementById('kakao-modal-bg').style.display = 'block';
  document.getElementById('nav').style.display = 'none';
}

function openRemoveModal() {
  document.getElementById('remove-modal-bg').style.display = 'block';
  document.getElementById('nav').style.display = 'none';
}

// Called when user clicks on 'Comments' button
function writeComments() {
  document.getElementById('emotions').style.display = 'none';
  document.getElementById('comment-box').style.display = 'block';
  document.getElementById('nav').style.display = 'none';
}

// Called when user clicks on each emotion to add
function createEmojiBox(){
  document.getElementById('confirm').style.display = 'none';
  document.getElementById('emotions').style.display = 'block';
  document.getElementById('comment-box').style.display = "none";
  //document.getElementById('guide').style.display = "none";
  document.getElementById('nav').style.display = "none";
  document.getElementById('undo').style.display = "block";
  document.querySelector('.emoji-box-item').appendChild(document.createElement('br'));
  document.querySelector('.emoji-box-item').appendChild(document.createElement('br'));

  removeEditables();
}

// This button event is for confirm buttons
function initBtnEvent() {
  document.getElementById("undo").addEventListener("click", function() {
    document.getElementById('emotions').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
    document.getElementById("undo").style.display = 'none';
    document.getElementById('confirm').style.display = 'none';
    removeEditables();
  });

  document.getElementById("confirm-button-cancel").addEventListener("click", function() {
    document.getElementById('emotions').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
    document.getElementById("undo").style.display = 'none';
    document.getElementById('confirm').style.display = 'none';
    removeEditables();
  });

  document.getElementById('confirm-button-ok').addEventListener('click', function() {

    editObject.element.classList.remove('helper');

    document.getElementById('emotions').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
    document.getElementById("undo").style.display = 'none';
    document.getElementById('confirm').style.display = 'none';
    document.getElementById('nav-kakao').style.display = 'block';

    if(editObject !== null) {
      renderItems.push(editObject);
      editObject = null;
      commentsIndex ++;
    }

    if(helpObject !== null) {
      // world.remove(helpObject);
      helpObject = {...commentTemplate};
    }

    removeEditables();
  });



  document.getElementById('kakao-modal-footer-cancel').addEventListener('click', function() {
    document.getElementById('kakao-modal-bg').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
  });

  document.getElementById('kakao-modal-footer-ok').addEventListener('click', function() {
    kakaoCommentShare();
    document.getElementById('kakao-modal-bg').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
  });

  document.getElementById('remove-modal-footer-cancel').addEventListener('click', function() {
    document.getElementById('remove-modal-bg').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
  });

  document.getElementById('remove-modal-footer-ok').addEventListener('click', function() {

    renderItems.forEach(function(item) {
      // world.remove(item);
    });

    renderItems = [];

    document.getElementById('remove-modal-bg').style.display = 'none';
    document.getElementById('nav').style.display = 'block';
    document.getElementById('nav-kakao').style.display = 'none';
  });
}

// remove renderable object from the world
function removeEditables() {
  if(editObject !== null) {
    // world.remove(editObject);
    editObject = null;
    commentsIndex --;
  }

  if(helpObject!== null) {
    // world.remove(helpObject);
    helpObject = null;
  }
}

/**
 * User adds comments by clicking on 저장 button.
 */
function addComments() {
  let cmt_content = document.getElementById('comment-box-content').value;
  let content_bytes = getBytesString(cmt_content.toString());

  if (content_bytes > 30 || content_bytes === 0 || cmt_content === null || cmt_content === '') {
    document.getElementById('comment-box-content').style.border = '1px solid red';
    window.alert("내용을 15자 이내로 간단하게 남겨주세요!");
    return;
  }

  if (cmt_content.toString().length <= 30 ) {
    // Open the confirm panel, so that users can update the position and orientation
    document.getElementById('comment-box').style.display = 'none';
    document.getElementById('confirm').style.display = 'block';
    commentDiv.style.display = 'none';

    let str_count = cmt_content.toString().length;
    let helpDiv = createHelpDiv('comment', str_count);
    // const help = createHelpRenderable(helpDiv);
    // world.add(help);

    const type = 'comment';
    const div = createCommentDiv(cmt_content);
    const commentRenderable = createCommentRenderable(div, type);
    // world.add(commentRenderable);
    commentRenderable.element.classList.add('renderable', 'helper');
    console.warn(commentRenderable);

  }
  // reset input and close the confirm panel
  document.getElementById('comment-box-content').value = '';
}

/**
 * Create comment div element for user message.
 * @param comment
 * @returns {string}
 */
function createCommentDiv(comment) {
  // let commentText = "#" + comment;
  const div =
      `
        <div class="wrap"><div class="comment"><div class="value">${comment}</div></div></div>
			`;

  return div;
}

// User adds emotions
function addEmoji(i) {
  console.log('add emotions: ' + i);
  document.getElementById('emotions').style.display = 'none';
  document.getElementById('confirm').style.display = 'block';
  document.getElementById('undo').style.display = 'none';

  manager.resetPosition();

  let helpDiv = createHelpDiv('emoji');
  const help = createHelpRenderable(helpDiv);
  // world.add(help);

  const type = 'emoji';
  /*const div =
      `
					<div class="imagebox">
						<div class="emo-items" style="font-size: 30px">${i}</div>
					</div>
				`;*/
  const div =
      `
					<div class="wrap"><div class="emoji"><div class="value" style="font-size: 50px">${i}</div></div></div>
				`;

  const emojiRenderable = createCommentRenderable(div, type);
  // world.add(emojiRenderable);
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
  // manager.resetPosition();

  renderable = createDOMRenderable(`<div data-id="${uid}" data-type="${type}">${_value}</div>`, position, rotation, scale);
  renderable.comment_type = type;
  editObject = renderable;

  return renderable;
}

function createHelpDiv(type, str_count) {
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
}

function createHelpRenderable(_value) {
  let position = [0, 0, (-3 * commentsIndex) - 15];
  let rotation = [0, 0, 0];
  let scale = [1, 1, 1];
  let renderable = null;
  let uid = UUID();

  renderable = createDOMRenderable(`<div data-id="${uid}" data-type="help">${_value}</div>`, position, rotation, scale);
  helpObject = renderable;

  return renderable;
}

// Function to get uuid
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

// parse Server
axios.defaults.baseURL = 'https://browser.letsee.io:8337/parse';
axios.defaults.headers.common['X-Parse-Application-Id'] = 'awe2019wallboard';

let shareObjectId;

function makeCommentObject(renderable) {
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
}

// Get data (comments & emotions) from server
function getComments() {
  console.log('getComments');
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
}

// get comments json array from parse server
function getShareCommentsByObjectId(objectId) {
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
}

// Function to make renderable and add to world using json data
function printCommentItemsFromJson(data) {
  data.forEach(function (item, index) {
    let position = [item.position._x, item.position._y, (index * -3) - 15];
    let rotation = [item.rotation._x, item.rotation._y, item.rotation._z];
    let scale = [item.scale._x, item.scale._y, item.scale._z];
    let renderableItem = createDOMRenderable(item.content, position, rotation, scale);
    // world.add(renderableItem);
    renderItems.push(renderableItem);
  });
}

//function printSharedComment
function hideRenderables() {
  console.log('hideRenderables');
  renderItems.forEach(function(item) {
    // world.remove(item);
  })
}

function showRenderables() {
  let commentBox = document.getElementById('comment-box');
  let emotions = document.getElementById('emotions');

  if(commentBox.style.display !== 'block' && emotions.style.display !== 'block')
    renderItems.forEach(function(item) {
      // world.add(item);
    })
}

function resetKakaoDefaultButtonUrl(objectId) {
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
}

// Post renderables json array to server.
function postShareComments(commentRenderables) {
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
}

// Function to get bytes by strings .
// inputbox: input string
function getBytesString(str)
{
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

function kakaoCommentShare() {
  postShareComments(renderItems)
  .then(() => {
    resetKakaoDefaultButtonUrl(shareObjectId);
    $("#kakao-link").trigger('click');
  });
}

/**
 * Show main contain when Engine starts.
 */
function showMainContent(){
  capture.style.display = 'none';
  if(window.location.search.substr(1) === "") {
    commentDiv.style.display = 'block';
  } else {
    shareMessage.style.display = 'block';
  }
}

window.onload = () => {

  commentDiv = document.getElementById('comment-div');
  shareMessage = document.getElementById('share-message');

  capture = document.getElementById('capture');
  guideHeaderStartBtn = document.getElementById('guide-header-btn-start');


  guideHeaderStartBtn.addEventListener('click', function() {
    document.getElementById('nav-kakao').style.display = 'none';
    document.getElementById('guide-bg').style.display = 'none';
    document.getElementById('nav-message').style.display = 'block';
  });
}