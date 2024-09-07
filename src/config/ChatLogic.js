
const getSender = (user,users)=>{
    return users[0]._id === user._id?  users[1].name :  users[0].name
}

const getSenderImage = (user, chat)=>{
    return chat.users[0]._id === user._id?  chat.users[1].pic :  chat.users[0].pic
}


const isSameSender = (messages, m, i, userId)=>{
    return(
        i<messages.length-1 && 
        (messages[i+1].sender._id !== m.sender._id ||
            messages[i+1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    )
}

const isLastMessage = (messages, i, userId)=>{
    return(
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}

const isSameSenderMargin = (messages, m, i, userId)=>{

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
      )
        return 33;
      else if (
        (i < messages.length - 1 &&
          messages[i + 1].sender._id !== m.sender._id &&
          messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
      )
        return 0;
      else return "auto";
};

const isSameUser = (messages, m, i)=>{
    return i>0 && messages[i - 1].sender._id === m.sender._id;
};

export {getSender, getSenderImage, isSameSender, isLastMessage, isSameSenderMargin, isSameUser}