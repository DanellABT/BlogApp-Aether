<template>
  <div class="bg-[#121212] min-h-screen text-[#ede1d0] flex justify-center selection:bg-[#ffb800] selection:text-[#271900]">
    
    <main class="flex-1 w-full max-w-2xl border-x border-[#514532]/10 relative pb-24" v-if="profileData">
      
      <!-- Header -->
      <header class="sticky top-0 z-50 backdrop-blur-md bg-[#181309]/80 border-b border-[#514532]/30 flex items-center px-4 h-14 gap-4">
        <button @click="$router.push('/')" class="hover:bg-[#3b3428]/50 p-2 rounded-full transition-colors"><span class="material-symbols-outlined">arrow_back</span></button>
        <div>
            <h1 class="font-bold text-xl">{{ profileData.user.username }}</h1>
            <p class="text-[#d5c4ab] text-xs">{{ profileData.posts.length }} Posts</p>
        </div>
      </header>

      <!-- Profile Banner & Info -->
      <div class="h-32 bg-[#3b3428] relative"></div>
      <div class="px-4 pb-4 border-b border-[#514532]/30 relative">
        <div class="flex justify-between items-start">
            
            <!-- AVATAR CONTAINER (Clickable if it's your own profile) -->
            <div 
              class="relative rounded-full -mt-12 border-4 border-[#121212] bg-[#181309]"
              :class="currentUser.username === profileData.user.username ? 'cursor-pointer group' : ''"
              @click="openAvatarModal"
            >
                <!-- Display Image if they have one -->
                <img v-if="profileData.user.profilePic" :src="profileData.user.profilePic" class="w-24 h-24 rounded-full object-cover" />
                
                <!-- Display Letter if no image -->
                <div v-else class="w-24 h-24 rounded-full bg-[#ffdca1] text-[#412d00] flex items-center justify-center font-bold text-4xl">
                    {{ profileData.user.username.charAt(0).toUpperCase() }}
                </div>

                <!-- Hover Camera Overlay (Only shows for the logged-in owner) -->
                <div v-if="currentUser.username === profileData.user.username" class="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="material-symbols-outlined text-white">photo_camera</span>
                </div>
            </div>
            
            <!-- SMART BUTTON: Edit Profile vs Follow -->
            <button v-if="currentUser.username === profileData.user.username" @click="openEditProfile" class="mt-3 border border-[#514532] text-[#ede1d0] font-bold px-5 py-1.5 rounded-full hover:bg-[#3b3428]/50 transition-colors">
                Edit Profile
            </button>
            <button v-else @click="toggleFollow" class="mt-3 bg-[#ede1d0] text-black font-bold px-5 py-1.5 rounded-full hover:bg-white transition-colors">
                {{ isFollowing ? 'Unfollow' : 'Follow' }}
            </button>
        </div>
        
        <div class="mt-3">
            <h2 class="font-bold text-xl">{{ profileData.user.username }}</h2>
            <p class="text-[#d5c4ab]">@{{ profileData.user.username.toLowerCase() }}</p>
            
            <!-- CLICKABLE FOLLOWERS / FOLLOWING -->
            <div class="flex gap-4 mt-3 text-sm">
                <span @click="showFollowingModal = true" class="text-[#d5c4ab] cursor-pointer hover:underline">
                  <strong class="text-white">{{ profileData.user.following?.length || 0 }}</strong> Following
                </span>
                <span @click="showFollowersModal = true" class="text-[#d5c4ab] cursor-pointer hover:underline">
                  <strong class="text-white">{{ profileData.user.followers?.length || 0 }}</strong> Followers
                </span>
            </div>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div class="flex border-b border-[#514532]/30 px-4">
        <button @click="activeTab = 'posts'" :class="activeTab === 'posts' ? 'text-[#ede1d0]' : 'text-[#d5c4ab]'" class="flex-1 py-4 font-bold text-lg relative hover:bg-[#3b3428]/50 transition-colors">
          Posts
          <div v-if="activeTab === 'posts'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#ffb800] rounded-t-full"></div>
        </button>
        <button @click="activeTab = 'replies'" :class="activeTab === 'replies' ? 'text-[#ede1d0]' : 'text-[#d5c4ab]'" class="flex-1 py-4 font-bold text-lg relative hover:bg-[#3b3428]/50 transition-colors">
          Replies
          <div v-if="activeTab === 'replies'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#ffb800] rounded-t-full"></div>
        </button>
      </div>

      <!-- Display Posts or Replies -->
      <div class="flex flex-col">
        <article v-for="post in (activeTab === 'posts' ? profileData.posts : profileData.replies)" :key="post._id" @click="$router.push(`/post/${post._id}`)" class="p-4 border-b border-[#514532]/30 hover:bg-[#130d05]/50 transition-colors cursor-pointer flex gap-3">
          <!-- Show avatar in feed -->
          <div class="shrink-0">
             <img v-if="post.author.profilePic" :src="post.author.profilePic" class="w-10 h-10 rounded-full object-cover" />
             <div v-else class="w-10 h-10 rounded-full bg-[#3b3428] flex items-center justify-center text-[#ede1d0] font-bold">{{ post.author.username.charAt(0).toUpperCase() }}</div>
          </div>
          
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="font-bold text-white">{{ post.author.username }}</span>
              <span class="text-[#d5c4ab] text-sm">· {{ new Date(post.creationDate).toLocaleDateString() }}</span>
            </div>
            <h2 class="font-bold text-[#ffdca1]">{{ post.title }}</h2>
            <p class="text-[#ede1d0]">{{ post.content }}</p>
          </div>
        </article>

        <div v-if="(activeTab === 'posts' ? profileData.posts : profileData.replies).length === 0" class="p-8 text-center text-[#d5c4ab]">
          Nothing to see here yet.
        </div>
      </div>
    </main>

    <div v-else class="flex-1 w-full max-w-2xl border-x border-[#514532]/10 flex justify-center items-center h-screen">
      <div class="text-[#ffdca1] font-bold text-xl flex items-center gap-3">
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
        Loading profile...
      </div>
    </div>

    <div v-if="showEditProfile" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showEditProfile = false"></div>
      <div class="relative bg-[#181309] border border-[#514532]/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-xl font-bold text-[#ffdca1]">Edit Profile</h3>
          <button @click="showEditProfile = false" class="text-[#d5c4ab] hover:text-white rounded-full p-1 transition-colors"><span class="material-symbols-outlined">close</span></button>
        </div>
        <form @submit.prevent="saveProfile" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-bold text-[#d5c4ab] mb-2">Username</label>
            <input v-model="editUsername" type="text" class="w-full bg-[#121212] border border-[#514532]/50 rounded-xl px-4 py-3 text-[#ede1d0] outline-none focus:border-[#ffb800] transition-colors" required />
          </div>
          <!-- Email input has been removed! -->
          <button type="submit" :disabled="editLoading" class="w-full mt-2 bg-[#ffb800] text-[#271900] hover:bg-[#ffdca1] font-bold py-3 rounded-full transition-colors shadow-lg disabled:opacity-50">
            {{ editLoading ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>
      </div>
    </div>

    <div v-if="showAvatarModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showAvatarModal = false"></div>
      <div class="relative bg-[#181309] border border-[#514532]/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-xl font-bold text-[#ffdca1]">Update Profile Picture</h3>
          <button @click="showAvatarModal = false" class="text-[#d5c4ab] hover:text-white rounded-full p-1 transition-colors"><span class="material-symbols-outlined">close</span></button>
        </div>
        <form @submit.prevent="saveAvatar" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-bold text-[#d5c4ab] mb-2">Image URL</label>
            <input v-model="editAvatarUrl" type="url" placeholder="https://example.com/my-image.jpg" class="w-full bg-[#121212] border border-[#514532]/50 rounded-xl px-4 py-3 text-[#ede1d0] outline-none focus:border-[#ffb800] transition-colors" />
            <p class="text-xs text-[#d5c4ab] mt-2">Paste a link to an image. Leave blank to remove your current picture.</p>
          </div>
          <button type="submit" :disabled="editLoading" class="w-full mt-2 bg-[#ffb800] text-[#271900] hover:bg-[#ffdca1] font-bold py-3 rounded-full transition-colors shadow-lg disabled:opacity-50">
            {{ editLoading ? 'Saving...' : 'Update Picture' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Followers & Following Modals remain exactly the same -->
    <div v-if="showFollowersModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showFollowersModal = false"></div>
      <div class="relative bg-[#181309] border border-[#514532]/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div class="flex items-center justify-between p-4 border-b border-[#514532]/30">
          <h3 class="text-lg font-bold text-white">Followers</h3>
          <button @click="showFollowersModal = false" class="text-[#d5c4ab] hover:text-white rounded-full"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="overflow-y-auto p-2">
          <div v-for="user in profileData.user.followers" :key="user._id" @click="goToProfile(user.username)" class="flex items-center gap-3 p-3 hover:bg-[#3b3428]/50 rounded-xl cursor-pointer transition-colors">
            <img v-if="user.profilePic" :src="user.profilePic" class="w-10 h-10 rounded-full object-cover" />
            <div v-else class="w-10 h-10 rounded-full bg-[#3b3428] flex items-center justify-center text-[#ede1d0] font-bold">{{ user.username.charAt(0).toUpperCase() }}</div>
            <span class="font-bold text-white">{{ user.username }}</span>
          </div>
          <div v-if="profileData.user.followers.length === 0" class="text-center p-6 text-[#d5c4ab]">No followers yet.</div>
        </div>
      </div>
    </div>

    <div v-if="showFollowingModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showFollowingModal = false"></div>
      <div class="relative bg-[#181309] border border-[#514532]/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div class="flex items-center justify-between p-4 border-b border-[#514532]/30">
          <h3 class="text-lg font-bold text-white">Following</h3>
          <button @click="showFollowingModal = false" class="text-[#d5c4ab] hover:text-white rounded-full"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="overflow-y-auto p-2">
          <div v-for="user in profileData.user.following" :key="user._id" @click="goToProfile(user.username)" class="flex items-center gap-3 p-3 hover:bg-[#3b3428]/50 rounded-xl cursor-pointer transition-colors">
            <img v-if="user.profilePic" :src="user.profilePic" class="w-10 h-10 rounded-full object-cover" />
            <div v-else class="w-10 h-10 rounded-full bg-[#3b3428] flex items-center justify-center text-[#ede1d0] font-bold">{{ user.username.charAt(0).toUpperCase() }}</div>
            <span class="font-bold text-white">{{ user.username }}</span>
          </div>
          <div v-if="profileData.user.following.length === 0" class="text-center p-6 text-[#d5c4ab]">Not following anyone yet.</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Notyf } from 'notyf';

const notyf = new Notyf();
const route = useRoute();
const router = useRouter();
const profileData = ref(null);
const activeTab = ref('posts');
const currentUser = ref({ id: null, username: '' });

const showEditProfile = ref(false);
const showFollowersModal = ref(false);
const showFollowingModal = ref(false);

const showAvatarModal = ref(false);
const editAvatarUrl = ref('');

const editUsername = ref('');
const editLoading = ref(false);

const isFollowing = computed(() => {
    if (!profileData.value?.user?.followers) return false;
    return profileData.value.user.followers.some(follower => follower._id === currentUser.value.id);
});

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUser.value = { id: payload.id, username: payload.username };
    }
    
    const res = await axios.get(`https://blogapp-api-vkv6.onrender.com/users/profile/${route.params.username}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    profileData.value = res.data;
  } catch (error) {
    notyf.error("Profile not found");
    router.push('/');
  }
};

const toggleFollow = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`https://blogapp-api-vkv6.onrender.com/users/${profileData.value.user._id}/follow`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchProfile(); 
    } catch (err) {
        notyf.error("Action failed");
    }
};

const openEditProfile = () => {
  editUsername.value = profileData.value.user.username;
  showEditProfile.value = true;
};

const openAvatarModal = () => {
  if (currentUser.value.username === profileData.value.user.username) {
    editAvatarUrl.value = profileData.value.user.profilePic || '';
    showAvatarModal.value = true;
  }
};

const saveProfile = async () => {
  editLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    await axios.put('https://blogapp-api-vkv6.onrender.com/users/profile', 
      { username: editUsername.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    showEditProfile.value = false;
    notyf.success("Username updated! Please log in again.");
    
    localStorage.removeItem('token');
    router.push('/login');
  } catch (err) {
    notyf.error(err.response?.data?.error || "Failed to update. Username may be taken.");
  } finally {
    editLoading.value = false;
  }
};

const saveAvatar = async () => {
  editLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    await axios.put('https://blogapp-api-vkv6.onrender.com/users/profile', 
      { profilePic: editAvatarUrl.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    showAvatarModal.value = false;
    notyf.success("Profile picture updated!");
    fetchProfile();
  } catch (err) {
    notyf.error("Failed to update profile picture.");
  } finally {
    editLoading.value = false;
  }
};

const goToProfile = (username) => {
  showFollowersModal.value = false;
  showFollowingModal.value = false;
  router.push(`/profile/${username}`);
};

watch(() => route.params.username, fetchProfile);
onMounted(fetchProfile);
</script>