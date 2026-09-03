<template>
  <div class="bg-[#121212] text-[#ede1d0] font-body-md antialiased min-h-screen flex flex-col md:flex-row pb-20 md:pb-0 selection:bg-[#ffb800] selection:text-[#271900]">
    
    <!-- Drawer Overlay (Mobile) -->
    <div v-show="drawerOpen" @click="drawerOpen = false" class="fixed inset-0 bg-[#181309]/50 backdrop-blur-sm z-[60] transition-opacity duration-300"></div>

    <!-- Navigation Drawer (Mobile) -->
    <nav :class="drawerOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed left-0 top-0 z-[70] h-full w-80 bg-[#251f14] rounded-r-xl border-r border-[#514532]/20 shadow-xl flex flex-col p-4 gap-2 transition-transform duration-300 ease-in-out">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-full bg-[#ffdca1] text-[#412d00] flex items-center justify-center font-bold text-xl">
          {{ currentUser.username?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-[#ffdca1] text-lg">{{ currentUser.username || 'Aether User' }}</span>
          <!-- Show Admin Badge if applicable -->
          <span v-if="currentUser.isAdmin" class="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded mt-1 w-fit">ADMIN</span>
        </div>
      </div>
      <button @click="handleLogout" class="flex items-center gap-4 p-3 text-red-400 hover:bg-[#3b3428]/50 transition-all rounded-lg active:opacity-80 text-left">
        <span class="material-symbols-outlined" data-weight="fill">logout</span>
        <span class="font-bold text-lg">Logout</span>
      </button>
    </nav>

    <!-- TopAppBar (Mobile & Tablet) -->
    <header class="md:hidden flex justify-between items-center px-4 h-14 w-full bg-[#181309]/80 fixed top-0 z-50 backdrop-blur-md border-b border-[#514532]/30 text-[#ffdca1]">
      <div class="flex items-center gap-2">
        <button @click="drawerOpen = true" class="active:scale-95 duration-150 p-1 rounded-full hover:bg-[#3b3428]/50 transition-colors">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <h1 class="font-bold text-xl tracking-tight">Aether</h1>
      </div>
    </header>

    <!-- SideNav (Web / Desktop) -->
    <nav class="hidden md:flex flex-col h-screen w-20 lg:w-64 border-r border-[#514532]/30 bg-[#181309]/80 fixed left-0 top-0 z-50 py-6 px-2 lg:px-4 shrink-0">
      <div class="flex items-center justify-center lg:justify-start lg:px-2 mb-8">
        <h1 class="font-bold text-2xl text-[#ffdca1] tracking-tight hidden lg:block">Aether</h1>
        <span class="material-symbols-outlined text-[#ffdca1] text-3xl lg:hidden">blur_on</span>
      </div>
      
      <div class="flex flex-col gap-2 flex-1">
        <a class="flex items-center gap-4 p-2 lg:p-4 text-[#ede1d0] font-bold rounded-lg group" href="#">
          <span class="material-symbols-outlined text-[#ffdca1]" data-weight="fill">home</span>
          <span class="hidden lg:block text-[#ffdca1]">Home</span>
        </a>
        <a class="flex items-center gap-4 p-2 lg:p-4 text-[#d5c4ab] hover:bg-[#3b3428]/50 transition-colors rounded-lg group" href="#">
          <span class="material-symbols-outlined group-hover:text-[#ffdca1]">search</span>
          <span class="hidden lg:block group-hover:text-[#ffdca1]">Explore</span>
        </a>
        <a class="flex items-center gap-4 p-2 lg:p-4 text-[#d5c4ab] hover:bg-[#3b3428]/50 transition-colors rounded-lg group" href="#">
          <span class="material-symbols-outlined group-hover:text-[#ffdca1]">notifications</span>
          <span class="hidden lg:block group-hover:text-[#ffdca1]">Notifications</span>
        </a>

        <!-- DYNAMIC PROFILE LINK -->
        <router-link v-if="currentUser.username" :to="`/profile/${currentUser.username}`" class="flex items-center gap-4 p-2 lg:p-4 text-[#d5c4ab] hover:bg-[#3b3428]/50 transition-colors rounded-lg group">
          <span class="material-symbols-outlined group-hover:text-[#ffdca1]">person</span>
          <span class="hidden lg:block group-hover:text-[#ffdca1]">Profile</span>
        </router-link>

        <button @click="handleLogout" class="flex items-center gap-4 p-2 lg:p-4 text-red-400 hover:bg-red-900/20 transition-colors rounded-lg group text-left mt-auto mb-4">
          <span class="material-symbols-outlined">logout</span>
          <span class="hidden lg:block font-bold">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Main Content Canvas -->
    <main class="flex-1 w-full max-w-2xl mx-auto pt-16 md:pt-0 md:ml-20 lg:ml-64 relative min-h-screen border-x border-[#514532]/10 bg-[#121212]">
      
      <!-- Top App Bar (Web) Tabs -->
      <header class="hidden md:flex sticky top-0 w-full z-40 backdrop-blur-md bg-[#181309]/80 border-b border-[#514532]/30 flex-col">
        <div class="flex border-b border-[#514532]/30 px-4 relative">
          <button @click="switchTab('foryou')" :class="activeTab === 'foryou' ? 'text-[#ede1d0]' : 'text-[#d5c4ab]'" class="flex-1 py-4 font-bold text-lg relative hover:bg-[#3b3428]/50 transition-colors">
            For You
            <div v-if="activeTab === 'foryou'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#ffb800] rounded-t-full"></div>
          </button>
          <button @click="switchTab('following')" :class="activeTab === 'following' ? 'text-[#ede1d0]' : 'text-[#d5c4ab]'" class="flex-1 py-4 font-bold text-lg relative hover:bg-[#3b3428]/50 transition-colors">
            Following
            <div v-if="activeTab === 'following'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#ffb800] rounded-t-full"></div>
          </button>
        </div>
      </header>

      <!-- Post Input (Web) - Only shows on 'For You' tab -->
      <div v-if="activeTab === 'foryou'" class="p-4 border-b border-[#514532]/30 flex gap-4">
        <div class="w-10 h-10 rounded-full bg-[#ffdca1] flex items-center justify-center text-[#412d00] font-bold shrink-0">
          {{ currentUser.username?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <form @submit.prevent="createPost" class="flex-1 flex flex-col gap-2">
          <input v-model="newTitle" id="postInput" placeholder="Thread Title..." class="w-full bg-transparent text-[#ede1d0] font-bold text-lg border-none focus:ring-0 p-0 mb-1 placeholder:text-[#d5c4ab]/50 outline-none" required />
          <textarea v-model="newContent" class="w-full bg-transparent text-[#ede1d0] text-lg resize-none border-none p-0 focus:ring-0 outline-none placeholder:text-[#d5c4ab]/50 min-h-[60px]" placeholder="What is happening?!" required></textarea>
          
          <div class="flex justify-between items-center mt-2 border-t border-[#514532]/20 pt-3">
            <div class="flex gap-1 text-[#ffdca1]">
              <button type="button" class="p-2 hover:bg-[#3b3428]/50 rounded-full transition-colors"><span class="material-symbols-outlined">image</span></button>
              <button type="button" class="p-2 hover:bg-[#3b3428]/50 rounded-full transition-colors"><span class="material-symbols-outlined">gif_box</span></button>
              <button type="button" class="p-2 hover:bg-[#3b3428]/50 rounded-full transition-colors"><span class="material-symbols-outlined">sentiment_satisfied</span></button>
            </div>
            <button type="submit" :disabled="loading" class="bg-[#ffb800] text-[#271900] px-5 py-1.5 rounded-full font-bold hover:bg-[#ffdca1] transition-colors disabled:opacity-50">Post</button>
          </div>
        </form>
      </div>

      <!-- Feed List -->
      <div class="flex flex-col pb-20 md:pb-0">
        <article 
          v-for="post in posts" 
          :key="post._id"
          @click="$router.push(`/post/${post._id}`)"
          class="p-4 md:p-5 border-b border-[#514532]/30 hover:bg-[#130d05]/50 transition-colors flex gap-3 md:gap-4 cursor-pointer"
        >
          <div class="shrink-0">
            <img v-if="post.author?.profilePic" :src="post.author.profilePic" class="w-10 h-10 rounded-full object-cover" />
            <div v-else class="w-10 h-10 rounded-full bg-[#3b3428] flex items-center justify-center text-[#ede1d0] font-bold">
              {{ post.author?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </div>
          
          <div class="flex-1 flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span @click.stop="$router.push(`/profile/${post.author?.username}`)" class="font-bold text-[#ede1d0] hover:underline">{{ post.author?.username || 'Unknown' }}</span>
              <span class="text-[#d5c4ab] text-sm">@{{ post.author?.username?.toLowerCase() || 'unknown' }}</span>
              <span class="text-[#d5c4ab] text-sm">· {{ new Date(post.creationDate).toLocaleDateString() }}</span>

              <!-- Modals triggers -->
              <div class="ml-auto flex gap-1">
                <button 
                  v-if="currentUser.id === post.author?._id" 
                  @click.stop="editPost(post)" 
                  class="text-blue-400 hover:bg-blue-400/20 p-1.5 rounded-full transition-colors" 
                  title="Edit Post">
                  <span class="material-symbols-outlined text-[18px]">edit</span>
                </button>

                <button 
                  v-if="currentUser.id === post.author?._id || currentUser.isAdmin" 
                  @click.stop="promptDelete(post._id)" 
                  class="text-red-400 hover:bg-red-400/20 p-1.5 rounded-full transition-colors" title="Delete Post">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
            
            <h2 class="font-bold text-lg mt-1 text-[#ffdca1]">{{ post.title }}</h2>
            <p class="text-[15px] leading-relaxed text-[#ede1d0]">{{ post.content }}</p>
            
            <!-- Interactions Bar -->
            <div class="flex justify-between items-center mt-3 text-[#d5c4ab] w-4/5 md:w-3/4">
              <button class="flex items-center gap-1.5 hover:text-[#ffdca1] transition-colors group">
                <div class="p-1.5 rounded-full group-hover:bg-[#ffdca1]/10 transition-colors"><span class="material-symbols-outlined text-[18px]">chat_bubble</span></div>
                <span class="text-sm">{{ post.comments?.length || 0 }}</span>
              </button>
              <button class="flex items-center gap-1.5 hover:text-emerald-500 transition-colors group">
                <div class="p-1.5 rounded-full group-hover:bg-emerald-500/10 transition-colors"><span class="material-symbols-outlined text-[18px]">repeat</span></div>
              </button>
              
              <!-- FUNCTIONAL LIKE BUTTON -->
              <button @click.stop="toggleLike(post._id)" :class="post.likes?.includes(currentUser.id) ? 'text-rose-500' : 'hover:text-rose-500'" class="flex items-center gap-1.5 transition-colors group">
                <div class="p-1.5 rounded-full group-hover:bg-rose-500/10 transition-colors">
                  <span class="material-symbols-outlined text-[18px]" :class="post.likes?.includes(currentUser.id) ? 'icon-filled' : ''">favorite</span>
                </div>
                <span class="text-sm">{{ post.likes?.length || 0 }}</span>
              </button>
              
              <button class="flex items-center gap-1.5 hover:text-[#ffdca1] transition-colors group">
                <div class="p-1.5 rounded-full group-hover:bg-[#ffdca1]/10 transition-colors"><span class="material-symbols-outlined text-[18px]">ios_share</span></div>
              </button>
            </div>
          </div>
        </article>

        <!-- Loading / Empty State -->
        <div v-if="posts.length === 0 && !loading" class="p-8 text-center text-[#d5c4ab]">
          No posts found.
        </div>
      </div>
    </main>

    <!-- RIGHT SIDEBAR: WHO TO FOLLOW -->
    <aside class="hidden lg:flex fixed right-0 top-0 h-full w-80 border-l border-[#514532]/30 flex-col p-6 gap-6 z-40 bg-[#121212] overflow-y-auto">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c4ab]">search</span>
        <input class="w-full bg-[#211b11] border border-[#514532] rounded-full py-2 pl-10 pr-4 text-[#ede1d0] placeholder:text-[#d5c4ab]/70 focus:border-[#ffb800] outline-none transition-all" placeholder="Search Aether" type="text"/>
      </div>
      <div class="bg-[#211b11] rounded-xl border border-[#514532] p-4 flex flex-col gap-4">
        <h2 class="text-xl font-bold text-[#ede1d0]">Who to follow</h2>
        
        <!-- Suggestions Loop -->
        <div v-for="user in suggestions" :key="user._id" class="flex items-center justify-between gap-2 p-2 hover:bg-[#3b3428]/50 rounded-lg transition-colors cursor-pointer" @click="$router.push(`/profile/${user.username}`)">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#3b3428] flex items-center justify-center text-[#ede1d0] font-bold">
              {{ user.username.charAt(0).toUpperCase() }}
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-[#ede1d0] hover:underline">{{ user.username }}</span>
              <span class="text-xs text-[#d5c4ab]">@{{ user.username.toLowerCase() }}</span>
            </div>
          </div>
          <!-- Follow Button -->
          <button @click.stop="toggleFollow(user._id)" class="bg-[#ede1d0] text-black font-bold text-sm px-4 py-1.5 rounded-full hover:bg-white transition-colors">
            Follow
          </button>
        </div>

        <div v-if="suggestions.length === 0" class="text-sm text-[#d5c4ab] text-center mt-2">You are following everyone!</div>
      </div>
    </aside>

  </div>

  <!-- EDIT POST MODAL -->
  <div v-if="showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showEditModal = false"></div>
    <!-- Modal Box -->
    <div class="relative bg-[#181309] border border-[#514532]/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-bold text-[#ffdca1]">Edit Post</h3>
        <button @click="showEditModal = false" class="text-[#d5c4ab] hover:text-white hover:bg-[#3b3428]/50 rounded-full p-1 transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold text-[#d5c4ab] mb-2">Title</label>
        <input v-model="editTitle" type="text" placeholder="Thread Title..." class="w-full bg-[#121212] border border-[#514532]/50 rounded-xl px-4 py-3 text-[#ede1d0] outline-none focus:border-[#ffb800] transition-colors" />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-bold text-[#d5c4ab] mb-2">Content</label>
        <textarea v-model="editContent" rows="6" placeholder="What is happening?!" class="w-full bg-[#121212] border border-[#514532]/50 rounded-xl px-4 py-3 text-[#ede1d0] outline-none resize-none focus:border-[#ffb800] transition-colors"></textarea>
      </div>
      <div class="flex gap-3">
        <button @click="showEditModal = false" :disabled="editLoading" class="flex-1 border border-[#514532] text-[#ede1d0] hover:bg-[#3b3428]/50 font-bold py-3 rounded-full transition-colors disabled:opacity-50">Cancel</button>
        <button @click="saveEditedPost" :disabled="editLoading" class="flex-1 bg-[#ffb800] text-[#271900] hover:bg-[#ffdca1] font-bold py-3 rounded-full transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
          <span v-if="editLoading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          {{ editLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>

  <!-- DELETE CONFIRMATION MODAL -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
    <div class="relative bg-[#181309] border border-[#514532]/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="text-xl font-bold text-[#ffdca1] mb-2">Delete Post?</h3>
      <p class="text-[#ede1d0] mb-6 text-sm">
        This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.
      </p>
      <div class="flex flex-col gap-3">
        <button @click="confirmDelete" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-colors shadow-lg">Delete</button>
        <button @click="showDeleteModal = false" class="w-full border border-[#514532] text-[#ede1d0] hover:bg-[#3b3428]/50 font-bold py-3 rounded-full transition-colors">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const router = useRouter();
const notyf = new Notyf();

const posts = ref([]);
const suggestions = ref([]);
const newTitle = ref('');
const newContent = ref('');
const loading = ref(false);
const activeTab = ref('foryou');

const currentUser = ref({ id: null, isAdmin: false, username: '' });
const drawerOpen = ref(false);

const showDeleteModal = ref(false);
const postToDelete = ref(null);
const showEditModal = ref(false);
const postToEdit = ref(null);
const editTitle = ref('');
const editContent = ref('');
const editLoading = ref(false);

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    notyf.error('Please log in to continue');
    router.push('/login'); 
  } else {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUser.value = { id: payload.id, isAdmin: payload.isAdmin, username: payload.username };
    } catch (e) {
      console.error("Invalid token format");
    }
  }
};

const fetchPosts = async () => {
  try {
    const endpoint = activeTab.value === 'foryou' ? '/posts' : '/posts/feed/following';
    const res = await axios.get(`https://blogapp-api-vkv6.onrender.com${endpoint}`, getAuthHeaders());
    posts.value = res.data;
  } catch (error) {
    notyf.error('Failed to load feed');
  }
};

const fetchSuggestions = async () => {
  try {
    const res = await axios.get('https://blogapp-api-vkv6.onrender.com/users/suggestions', getAuthHeaders());
    suggestions.value = res.data;
  } catch (error) { }
};

const switchTab = (tab) => {
  activeTab.value = tab;
  fetchPosts();
};

const toggleLike = async (id) => {
  try {
    await axios.post(`https://blogapp-api-vkv6.onrender.com/posts/${id}/like`, {}, getAuthHeaders());
    fetchPosts(); 
  } catch (err) { notyf.error("Failed to like post"); }
};

const toggleFollow = async (id) => {
  try {
    await axios.post(`https://blogapp-api-vkv6.onrender.com/users/${id}/follow`, {}, getAuthHeaders());
    notyf.success("Followed!");
    fetchSuggestions(); 
    if (activeTab.value === 'following') fetchPosts(); 
  } catch (err) { notyf.error("Failed to follow"); }
};

const createPost = async () => {
  if (!newTitle.value || !newContent.value) return;
  loading.value = true;
  try {
    await axios.post('https://blogapp-api-vkv6.onrender.com/posts', 
      { title: newTitle.value, content: newContent.value },
      getAuthHeaders()
    );
    notyf.success('Posted to Aether');
    newTitle.value = '';
    newContent.value = '';
    fetchPosts();
  } catch (error) {
    notyf.error('Session expired. Please log in again.');
    handleLogout();
  } finally {
    loading.value = false;
  }
};

const editPost = (post) => {
  postToEdit.value = post;
  editTitle.value = post.title;
  editContent.value = post.content;
  showEditModal.value = true;
};

const saveEditedPost = async () => {
  if (!editTitle.value.trim() || !editContent.value.trim()) {
    notyf.error('Title and content cannot be empty');
    return;
  }
  editLoading.value = true;
  try {
    await axios.put(
      `https://blogapp-api-vkv6.onrender.com/posts/${postToEdit.value._id}`,
      { title: editTitle.value.trim(), content: editContent.value.trim() },
      getAuthHeaders()
    );
    notyf.success('Post updated successfully');
    showEditModal.value = false;
    postToEdit.value = null;
    editTitle.value = '';
    editContent.value = '';
    await fetchPosts();
  } catch (error) {
    notyf.error(error.response?.data?.message || 'Failed to update post');
  } finally {
    editLoading.value = false;
  }
};

const promptDelete = (id) => {
  postToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!postToDelete.value) return;
  try {
    await axios.delete(`https://blogapp-api-vkv6.onrender.com/posts/${postToDelete.value}`, getAuthHeaders());
    notyf.success('Post deleted successfully');
    fetchPosts();
  } catch (error) {
    notyf.error(error.response?.data?.message || 'Failed to delete post');
  } finally {
    showDeleteModal.value = false;
    postToDelete.value = null;
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  notyf.success('Logged out safely');
  router.push('/login');
};

const focusPostInput = () => {
  document.getElementById('postInput')?.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  checkAuth();
  fetchPosts();
  fetchSuggestions();
});
</script>