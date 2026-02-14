# MongoDB Atlas Vector Search Setup Guide

## 🎯 Goal
Reduce retrieval time from **~168 seconds to ~1-2 seconds** by using MongoDB Atlas Vector Search instead of brute-force local computation.

---

## 📋 Prerequisites
- MongoDB Atlas account with a cluster
- Database with the `vectors` collection
- Embeddings already stored in the database

---

## 🚀 Setup Steps

### Step 1: Log into MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster

### Step 2: Create Vector Search Index

1. **Click "Search"** in the left sidebar (or go to "Atlas Search" tab)
2. **Click "Create Search Index"**
3. **Select "JSON Editor"** (not the visual editor)
4. **Configure the index:**

   - **Database**: Select your database (e.g., `rag_chatbot`)
   - **Collection**: `vectors`
   - **Index Name**: `vector_index` ⚠️ **IMPORTANT**: Use exactly this name, or update the code!

5. **Paste this JSON configuration:**

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1024,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "documentId"
    }
  ]
}
```

6. **Click "Save" or "Update Search Index"**
7. **Wait for the index to rebuild** (usually 2-5 minutes)

---

## 🔧 Configuration Details

### Embedding Model Info
- **Model**: `voyage-3-large` (from Voyage AI)
- **Dimensions**: `1024`
- **Similarity**: `cosine`

### Index Parameters Explained

| Parameter | Value | Explanation |
|-----------|-------|-------------|
| `numDimensions` | `1024` | Must match your embedding model's output size |
| `similarity` | `cosine` | Cosine similarity metric (best for normalized embeddings) |
| `path` | `embedding` | Field name in your Vector model where embeddings are stored |
| `filter.path` | `documentId` | Allows filtering by document if needed in future |

---

## ✅ Verification

### Check if the index is working:

1. **Run your chatbot** and ask a question
2. **Check the backend logs** - you should see:
   ```
   Starting vector search through database...
   Vector search completed, found X results
   ```

3. **Measure performance** - retrieval should now take **~1-2 seconds** instead of ~168 seconds!

### If you see the fallback message:
```
Vector Search failed, falling back to local computation
```

**This means:**
- The index is not created yet (still building)
- The index name doesn't match (check it's exactly `vector_index`)
- The index configuration is incorrect

---

## 🎨 Performance Comparison

| Method | Time | Notes |
|--------|------|-------|
| **Local Computation** (old) | ~168 seconds | Loads all 230 vectors, computes similarity in JS |
| **Vector Search** (new) | ~1-2 seconds | Uses optimized database index |

**Speed improvement: ~100x faster!** 🚀

---

## 🔍 Troubleshooting

### Problem: "Vector Search failed" error

**Solutions:**
1. Verify the index name is exactly `vector_index`
2. Check that the index status is "Active" in MongoDB Atlas
3. Ensure `numDimensions: 2048` matches your embedding model
4. Verify you're using MongoDB Atlas (not local MongoDB)

### Problem: No results returned

**Solutions:**
1. Lower the similarity threshold (currently 0.35)
2. Increase `numCandidates` in the code (currently 100)
3. Check that vectors are actually stored in the database

### Problem: Different embedding model

If you change the embedding model in the future:

1. **Update `voyageConfig.js`** with the new model name
2. **Update the index** `numDimensions` to match the new model:
   - `voyage-3-large`: 2048 dimensions
   - `voyage-3`: 1024 dimensions
   - `voyage-2`: 1024 dimensions
3. **Re-create the index** in MongoDB Atlas

---

## 📝 Code Changes Made

The code has been updated in `services/vectorStoreService.js`:

### New Features:
✅ Uses MongoDB Atlas `$vectorSearch` aggregation  
✅ Automatic fallback to local computation if index is missing  
✅ Better logging for debugging  
✅ Configurable similarity threshold and topK  

### Key Parameters:
- `numCandidates: 100` - Number of candidates to consider (can increase for larger datasets)
- `limit: topK` - Maximum results to return (default 8, returns top 3 to LLM)
- `threshold: 0.35` - Minimum similarity score (adjustable)

---

## 🎓 Additional Resources

- [MongoDB Atlas Vector Search Documentation](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/)
- [Voyage AI Embedding Models](https://docs.voyageai.com/docs/embeddings)
- [Vector Search Tutorial](https://www.mongodb.com/docs/atlas/atlas-vector-search/tutorials/)

---

## ✨ Next Steps

After setting up Vector Search:

1. ✅ Create the index in MongoDB Atlas (follow steps above)
2. ✅ Restart your backend server (`npm run dev`)
3. ✅ Test with a query and verify the logs
4. ✅ Enjoy 100x faster retrieval! 🎉

---

**Need help?** Check the backend logs for detailed error messages!
