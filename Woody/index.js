// Get the tweet container element
const tweetContainer = document.getElementById("tweet-container");

// Fetch the tweet data from the URL
fetch("https://touiteur.cefim-formation.org/list")
.then((response) => response.json())
.then((data) => {
    if (!data || !data.messages || !Array.isArray(data.messages)) {
    console.error("Invalid response data format.");
    return;
    }

    // Reverse the tweet messages array and get the last 30 tweets
    const lastTweets = data.messages.reverse().slice(0, 15);

    // Loop through the last 30 tweets and extract the tweet properties
    for (let i = 0; i < lastTweets.length; i++) {
    const tweet = lastTweets[i];

      // Extract the tweet properties
      const id = tweet.id;
      const name = tweet.name;
      const message = tweet.message;
      const ts = formatTimestamp(tweet.ts);
      const likes = tweet.likes;
      const comments_count = tweet.comments_count;
      const ip = tweet.ip;

      // Create a new div element to hold the tweet properties
    const tweetElement = document.createElement("div");
    tweetElement.classList.add("tweet");

    const tweetHeader = document.createElement("div");
    tweetHeader.classList.add("tweet-header");
    tweetElement.appendChild(tweetHeader);

    const tweetName = document.createElement("div");
    tweetName.classList.add("tweet-name");
    tweetName.textContent = name;
    tweetHeader.appendChild(tweetName);

    const tweetTs = document.createElement("div");
    tweetTs.classList.add("tweet-ts");
    tweetTs.textContent = ts;
    tweetHeader.appendChild(tweetTs);

    const tweetMessage = document.createElement("div");
    tweetMessage.classList.add("tweet-message");
    tweetMessage.textContent = message;
    tweetElement.appendChild(tweetMessage);

    const tweetFooter = document.createElement("div");
    tweetFooter.classList.add("tweet-footer");
    tweetElement.appendChild(tweetFooter);

    const tweetLikes = document.createElement("button");
  tweetLikes.classList.add("tweet-likes-class");
  tweetLikes.textContent = "Likes: " + likes;
  tweetLikes.setAttribute("id", "tweet-likes-" + id); // Generate a unique ID for each tweet's like button
  tweetFooter.appendChild(tweetLikes);


    const tweetComments = document.createElement("div");
    tweetComments.classList.add("tweet-comments");
    tweetComments.textContent = "Comments: " + comments_count;
    tweetFooter.appendChild(tweetComments);
    


    // Add the tweet element to the tweet container
    tweetContainer.appendChild(tweetElement);

    // Add the event listener to the tweet's like button
  const tweetLikesButton = document.getElementById("tweet-likes-" + id);
  tweetLikesButton.addEventListener("click", function() {
    likeTouit(id);
});

    }
})
.catch((error) => console.error(error));

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}





// ENVOI DE MSG + NAME

function sendTweet(name, message) {
    const tweet = { name, message };

    fetch("https://touiteur.cefim-formation.org/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "name=" + encodeURIComponent(name) + "&message=" + encodeURIComponent(message)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent the default form submission behavior
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;
    sendTweet(name, message);
});


// Tendeance

// Define the API endpoint
const urlApi = "https://touiteur.cefim-formation.org/";

// Fetch the list of trending words from the API
async function getTrendingTweets() {
    try {
        const response = await fetch(urlApi + "trending");  // Send a GET request to the API
        const data = await response.json();  // Parse the response as JSON
        return data;  // Return the data as an object
    } catch (error) {
        console.log(error);  // Log any errors to the console
        return null;  // Return null if an error occurred
    }
}

// Display the list of trending words on the page
async function displayTrendingTweets() {
    const popularList = document.getElementById("popular-list");  // Get the <ul> element to display the list
    const trendingWords = await getTrendingTweets();  // Call the getTrendingTweets function to fetch the data
    const sortedWords = Object.entries(trendingWords).sort((a, b) => b[1] - a[1]); // Sort the words by frequency in descending order
    const top10Words = sortedWords.slice(0, 10);  // Get the top 10 words by frequency
  
    for (const [word, frequency] of top10Words) {  // Loop over each word
      const listItem = document.createElement("li");  // Create a new <li> element to display the word
      listItem.textContent = `${word} (${frequency})`;  // Set the text content of the <li> element to the word and its frequency
      popularList.appendChild(listItem);  // Add the <li> element to the <ul> element on the page
    }
  }
// Call the displayTrendingTweets function to display the list of trending words on the page
displayTrendingTweets();

// Fonction pour ajout et suppression like

function likeTouit(id) {
    fetch(urlApi + "likes/send", {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "message_id=" + encodeURIComponent(id)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}

    const tweetLikesButton = document.getElementById("tweet-likes-id");
    tweetLikesButton.addEventListener("click", function() {
      const messageId = "your-message-id"; // replace with the actual message ID
      likeTouit(messageId);
    });
