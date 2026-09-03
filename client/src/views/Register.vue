<template>
  <div class="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center">
      <div class="w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] opacity-70"></div>
    </div>

    <main class="w-full max-w-md px-4 z-10 mt-8 pb-12">
      <div class="text-center mb-10">
        <h1 class="font-display-sm text-3xl font-bold text-on-surface mb-2">Join the Conversation</h1>
        <p class="text-on-surface-variant">Create your Aether account to start reading and writing.</p>
      </div>

      <div class="bg-surface-container rounded-xl p-6 border border-outline-variant/30 shadow-2xl relative overflow-hidden">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          
          <div>
            <label class="text-on-surface-variant block mb-1 text-sm font-semibold">Email Address</label>
            <input v-model="email" type="email" required class="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded text-on-surface focus:border-primary p-3 outline-none" placeholder="name@example.com" />
          </div>

          <div>
            <label class="text-on-surface-variant block mb-1 text-sm font-semibold">Username</label>
            <input v-model="username" type="text" required class="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded text-on-surface focus:border-primary p-3 outline-none" placeholder="@username" />
          </div>

          <div>
            <label class="text-on-surface-variant block mb-1 text-sm font-semibold">Password</label>
            <input v-model="password" type="password" required class="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded text-on-surface focus:border-primary p-3 outline-none" placeholder="Create a strong password" />
          </div>

          <button type="submit" class="w-full bg-primary-container text-black font-bold rounded py-3 mt-4 hover:bg-primary transition-colors">
            Register
          </button>
        </form>

        <div class="mt-6 text-center pt-4 border-t border-outline-variant/20">
          <p class="text-on-surface-variant text-sm">
            Already have an account? 
            <router-link to="/login" class="text-primary hover:underline ml-1">Log in</router-link>
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
const username = ref('');
const password = ref('');

const handleRegister = async () => {
  try {
    await axios.post('https://blogapp-api-vkv6.onrender.com/users/register', {
      email: email.value,
      username: username.value,
      password: password.value
    });
    notyf.success('Registered successfully!');
    router.push('/login');
  } catch (error) {
    notyf.error(error.response?.data?.message || 'Registration failed');
  }
};
</script>