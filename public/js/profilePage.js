const getAllPosts = async () => {
  const repliesTab = selectedTab === "replies" ? true : false;

  let postsResult = await axios.get("/api/posts", {
    params: {
      postedBy: profileUserId,
      isReply: repliesTab,
    },
  });
  outputPosts(
    postsResult.data.posts,
    document.querySelector(".postsContainer")
  );
};

getAllPosts();

//function for refreshing the message Badge
const refreshMessagesBadge = () => {
  axios.get("/api/chats", { params: { unreadOnly: true } }).then((results) => {
    const messageNotificationsNo = results.data.chats.length;
    if (messageNotificationsNo === null || messageNotificationsNo === 0) {
      document.getElementById("messagesBadge").classList.remove("active");
    } else {
      document.getElementById("messagesBadge").textContent =
        messageNotificationsNo;
      document.getElementById("messagesBadge").classList.add("active");
    }
  });
};