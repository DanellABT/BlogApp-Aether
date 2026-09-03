<template>
  <div class="bg-[#121212] min-h-screen text-on-surface flex justify-center">
    <main class="flex-1 w-full max-w-2xl border-x border-outline-variant/10 relative pb-24" v-if="post">
      
      <header class="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-outline-variant/30 flex items-center px-4 h-14 gap-4">
        <button @click="$router.push('/')" class="hover:bg-surface-variant/50 p-2 rounded-full"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1 class="font-bold text-xl">Post</h1>
      </header>

      <article class="p-4 border-b border-[#2A2A2A] bg-[#1A1A1B]">
        <div class="flex items-center gap-3 mb-4">
          <img v-if="post.author?.profilePic" :src="post.author.profilePic" class="w-12 h-12 rounded-full object-cover" />
            <div v-else class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl">
              {{ post.author?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
          <div>
            <div class="font-bold text-white">{{ post.author?.username || 'Unknown' }}</div>
            <div class="text-on-surface-variant text-sm">{{ new Date(post.creationDate).toLocaleString() }}</div>
          </div>
        </div>
        <h2 class="text-2xl font-bold mb-2">{{ post.title }}</h2>
        <p class="text-lg leading-relaxed mb-4">{{ post.content }}</p>
      </article>

      <section>
        <article v-for="comment in post.comments" :key="comment._id" class="p-4 border-b border-[#2A2A2A] flex gap-3">
          <div class="flex-1">
            <div class="flex items-baseline gap-2 mb-1">
              <span class="font-bold text-white">{{ comment.author?.username || 'Unknown User' }}</span>
            </div>
            <p class="text-on-surface">{{ comment.text }}</p>
          </div>
        </article>
      </section>

      <form @submit.prevent="addComment" class="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-background/90 backdrop-blur-md border-t border-[#2A2A2A] p-3 flex gap-3 z-40">
        <input v-model="newComment" type="text" placeholder="Post your reply..." required class="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-full py-2 px-4 text-white focus:border-primary outline-none" />
        <button type="submit" class="bg-primary-container text-black px-4 py-2 rounded-full font-bold hover:bg-primary transition-colors">Reply</button>
      </form>

    </main>
    <div v-else class="text-center mt-20">Loading thread...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Notyf } from 'notyf';

const notyf = new Notyf();
const route = useRoute();
const post = ref(null);
const newComment = ref('');

const fetchPost = async () => {
  try {
    const res = await axios.get(`https://blogapp-api-vkv6.onrender.com/posts/${route.params.id}`);
    post.value = res.data;
  } catch (error) {
    notyf.error("Post not found");
  }
};

const addComment = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`https://blogapp-api-vkv6.onrender.com/posts/${post.value._id}/comments`, 
      { text: newComment.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    notyf.success("Reply added");
    newComment.value = '';
    fetchPost(); 
  } catch (error) {
    notyf.error("Please log in to reply");
  }
};

onMounted(fetchPost);
</script>