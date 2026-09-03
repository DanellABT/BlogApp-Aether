<template>
  <div class="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center">
      <div class="w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] opacity-70"></div>
    </div>

    <main class="w-full max-w-md px-4 z-10 mt-8 pb-12">
      <div class="text-center mb-10">
        <h1 class="font-display-sm text-3xl font-bold text-on-surface mb-2">Welcome Back</h1>
        <p class="text-on-surface-variant">Log in to your Aether account to continue.</p>
      </div>

      <div class="bg-surface-container rounded-xl p-6 border border-outline-variant/30 shadow-2xl relative overflow-hidden">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          
          <div>
            <label class="text-on-surface-variant block mb-1 text-sm font-semibold">Email Address</label>
            <input v-model="email" type="email" required class="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded text-on-surface focus:border-primary p-3 outline-none" placeholder="name@example.com" />
          </div>

          <div>
            <label class="text-on-surface-variant block mb-1 text-sm font-semibold">Password</label>
            <input v-model="password" type="password" required class="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded text-on-surface focus:border-primary p-3 outline-none" placeholder="Enter your password" />
          </div>

          <button type="submit" class="w-full bg-primary-container text-black font-bold rounded py-3 mt-4 hover:bg-primary transition-colors">
            Log In
          </button>
        </form>

        <div class="mt-6 text-center pt-4 border-t border-outline-variant/20">
          <p class="text-on-surface-variant text-sm">
            Don't have an account? 
            <router-link to="/register" class="text-primary hover:underline ml-1">Register here</router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post('https://blogapp-api-vkv6.onrender.com/users/login', {
      email: email.value,
      password: password.value
    });

    localStorage.setItem('token', response.data.access);
    
    notyf.success('Logged in successfully!');
    
    // Redirect to the Home / For You page
    router.push('/');
  } catch (error) {
    notyf.error(error.response?.data?.message || 'Login failed. Check your credentials.');
  }
};
</script>