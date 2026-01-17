
import { FacetigramData } from './types';

export const INITIAL_DATA: FacetigramData = {
    "users": [
        {
          "user_id": 1, 
          "username": "ilmanwally", 
          "email": "ilman@example.com", 
          "bio": "Pecinta teknologi dan musik 🎸💻", 
          "followers": [2, 3], 
          "following": [2],
          "profile_pic": "https://picsum.photos/seed/ilman/200"
        },
        {
          "user_id": 2, 
          "username": "nina_joy", 
          "email": "nina@example.com", 
          "bio": "Fotografer & traveler 📸✈️", 
          "followers": [1], 
          "following": [1, 3],
          "profile_pic": "https://picsum.photos/seed/nina/200"
        },
        {
          "user_id": 3, 
          "username": "raymond99", 
          "email": "raymond@example.com", 
          "bio": "Gamer & programmer 🎮⌨️", 
          "followers": [1, 2], 
          "following": [],
          "profile_pic": "https://picsum.photos/seed/ray/200"
        }
    ],
    "posts": [
        {
          "post_id": 101, 
          "user_id": 1, 
          "content": "Hari ini belajar AI prompt engineering! Benar-benar membuka wawasan baru tentang bagaimana kita berinteraksi dengan model bahasa besar.", 
          "media_url": "https://picsum.photos/seed/ai101/800/600", 
          "likes": [2, 3], 
          "comments": [1001], 
          "hashtags": ["#AI", "#Learning", "#PromptEngineering"],
          "timestamp": "2026-01-16T14:30:00"
        },
        {
          "post_id": 102, 
          "user_id": 2, 
          "content": "Foto sunset di Bali 🌅. Keindahan alam yang tidak pernah gagal membuatku terpukau.", 
          "media_url": "https://picsum.photos/seed/bali/800/600", 
          "likes": [1], 
          "comments": [], 
          "hashtags": ["#Travel", "#Bali", "#Photography"],
          "timestamp": "2026-01-17T18:00:00"
        },
        {
          "post_id": 103, 
          "user_id": 3, 
          "content": "Setup baru untuk coding malam ini. Mechanical keyboard feels so good!", 
          "media_url": "https://picsum.photos/seed/setup/800/600", 
          "likes": [1, 2], 
          "comments": [], 
          "hashtags": ["#Coding", "#Workstation", "#Developer"],
          "timestamp": "2026-01-18T20:15:00"
        }
    ],
    "comments": [
        {
          "comment_id": 1001, 
          "post_id": 101, 
          "user_id": 2, 
          "content": "Wah keren banget Ilman! Harus coba juga nih.",
          "timestamp": "2026-01-16T15:00:00"
        }
    ],
    "stories": [
        {"story_id": 201, "user_id": 1, "media_url": "https://picsum.photos/seed/story1/400/700", "timestamp": "2026-01-17T10:00:00"},
        {"story_id": 202, "user_id": 2, "media_url": "https://picsum.photos/seed/story2/400/700", "timestamp": "2026-01-17T11:00:00"}
    ],
    "direct_messages": [
        {"dm_id": 301, "sender_id": 1, "receiver_id": 2, "content": "Halo Nina! Mau kolaborasi foto?", "timestamp": "2026-01-17T12:00:00"},
        {"dm_id": 302, "sender_id": 2, "receiver_id": 1, "content": "Boleh Ilman! Kapan?", "timestamp": "2026-01-17T12:05:00"}
    ]
};
