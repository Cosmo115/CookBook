'use client'
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Edit, Trash2, Shuffle, ChefHat, Clock, Users } from 'lucide-react';
import { db } from '../firebaseconfig';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

// Firebase functions
const firebaseOperations = {
  async getRecipes(category) {
    try {
      const recipesCollection = collection(db, 'CookBook');
      let q;
      
      if (category === 'all') {
        q = recipesCollection;
      } else {
        q = query(recipesCollection, where('category', '==', category));
      }
      
      const querySnapshot = await getDocs(q);
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      
      return recipes;
    } catch (error) {
      console.error('Error getting recipes:', error);
      return [];
    }
  },

  async addRecipe(recipe) {
    try {
      const docRef = await addDoc(collection(db, 'CookBook'), recipe);
      return { id: docRef.id, ...recipe };
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  },

  async deleteRecipe(id) {
    try {
      await deleteDoc(doc(db, 'CookBook', id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }
};

const RecipeWebsite = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    author: '',
    category: 'breakfast',
    ingredients: [''],
    steps: ['']
  });

  useEffect(() => {
    loadRecipes();
  }, [selectedCategory]);

  const loadRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await firebaseOperations.getRecipes(selectedCategory);
      setRecipes(data);
      if (data.length > 0 && !selectedRecipe) {
        setSelectedRecipe(data[0]);
      }
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
    setSelectedRecipe(null);
  };

  const handleRandomRecipe = () => {
    if (recipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setSelectedRecipe(recipes[randomIndex]);
    }
  };

  const handleAddRecipe = async () => {
    if (newRecipe.name && newRecipe.author) {
      setLoading(true);
      setError('');
      
      try {
        const filteredIngredients = newRecipe.ingredients.filter(i => i.trim());
        const filteredSteps = newRecipe.steps.filter(s => s.trim());
              
        const recipeToAdd = {
          ...newRecipe,
          ingredients: filteredIngredients,
          steps: filteredSteps,
          createdAt: new Date().toISOString()
        };
              
        await firebaseOperations.addRecipe(recipeToAdd);
        setNewRecipe({
          name: '',
          author: '',
          category: 'breakfast',
          ingredients: [''],
          steps: ['']
        });
        setShowAddForm(false);
        await loadRecipes();
      } catch (err) {
        setError('Failed to add recipe');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    setLoading(true);
    setError('');
    
    try {
      await firebaseOperations.deleteRecipe(recipeId);
      await loadRecipes();
      if (selectedRecipe && selectedRecipe.id === recipeId) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      setError('Failed to delete recipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addIngredientField = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, '']
    });
  };

  const addStepField = () => {
    setNewRecipe({
      ...newRecipe,
      steps: [...newRecipe.steps, '']
    });
  };

  const updateIngredient = (index, value) => {
    const updated = [...newRecipe.ingredients];
    updated[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: updated });
  };

  const updateStep = (index, value) => {
    const updated = [...newRecipe.steps];
    updated[index] = value;
    setNewRecipe({ ...newRecipe, steps: updated });
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'dessert': return '🧁';
      default: return '📚';
    }
  };

  const getCategoryGradient = (category) => {
    switch(category) {
      case 'breakfast': return 'from-yellow-400 via-orange-400 to-red-400';
      case 'lunch': return 'from-green-400 via-teal-400 to-blue-400';
      case 'dinner': return 'from-purple-400 via-pink-400 to-red-400';
      case 'dessert': return 'from-pink-400 via-purple-400 to-indigo-400';
      default: return 'from-amber-400 via-orange-400 to-red-400';
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-center py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Recipe Kitchen
              </h1>
              <p className="text-sm text-slate-600">Discover & Create Amazing Recipes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white/90 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-2xl mt-20 relative z-30">
        {/* Controls */}
        <div className="p-6 space-y-4">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex items-center justify-between p-4 bg-gradient-to-r ${getCategoryGradient(selectedCategory)} text-white rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(selectedCategory)}</span>
                <span className="font-semibold">
                  {selectedCategory === 'all' ? 'All Recipes' :
                    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {['all', 'breakfast', 'lunch', 'dinner', 'dessert'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {getCategoryIcon(category)}
                    </span>
                    <span className="font-medium text-slate-700">
                      {category === 'all' ? 'All Recipes' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Random Recipe Button */}
          <button
            onClick={handleRandomRecipe}
            disabled={loading || recipes.length === 0}
            className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Shuffle className="w-5 h-5" />
            <span className="font-semibold">Surprise Me!</span>
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 text-sm rounded-2xl shadow-sm">
            {error}
          </div>
        )}
        
        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent">
          {loading && recipes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading delicious recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <p className="text-slate-500 font-medium">No recipes found</p>
              <p className="text-slate-400 text-sm mt-1">Try a different category or add a new recipe!</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    selectedRecipe && selectedRecipe.id === recipe.id 
                      ? 'bg-gradient-to-r from-orange-100 to-amber-100 shadow-lg transform scale-[1.02] border-2 border-orange-300' 
                      : 'bg-white/60 hover:bg-white/80 hover:shadow-md hover:transform hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-orange-700 transition-colors duration-200">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <span className="text-xs">👨‍🍳</span>
                        </div>
                        <span className="text-sm text-slate-600 font-medium">by {recipe.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-200 to-amber-200 text-orange-800 text-xs font-semibold rounded-full">
                          {recipe.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {recipe.ingredients?.length || 0} ingredients
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecipe(recipe.id);
                      }}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-50 rounded-full"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Add Recipe Button */}
        <div className="p-6 border-t border-white/20">
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Recipe</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-20">
        {/* Recipe Header */}
        {selectedRecipe && (
          <div className="bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border-b border-white/20 p-8 shadow-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">{selectedRecipe.name}</h1>
              <div className="flex items-center justify-center gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <span className="text-sm">👨‍🍳</span>
                  </div>
                  <span className="font-medium">Created by {selectedRecipe.author}</span>
                </div>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-200 to-amber-200 text-orange-800 font-semibold rounded-full text-sm">
                    {selectedRecipe.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedRecipe ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-xl">🥄</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Ingredients</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        </div>
                        <span className="text-slate-700 font-medium leading-relaxed">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Steps */}
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Instructions</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedRecipe.steps.map((step, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <span className="text-6xl">🍳</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-700 mb-2">Choose a Recipe</h2>
                <p className="text-slate-500 text-lg">Select a recipe from the sidebar to start cooking!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Recipe Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Create New Recipe</h2>
              <p className="text-slate-600 mt-2">Share your culinary masterpiece with the world</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 text-sm rounded-2xl">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3 text-slate-700">Recipe Name</label>
                  <input
                    type="text"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
                    placeholder="Enter an amazing recipe name"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-3 text-slate-700">Chef Name</label>
                  <input
                    type="text"
                    value={newRecipe.author}
                    onChange={(e) => setNewRecipe({ ...newRecipe, author: e.target.value })}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
                    placeholder="Who's the master chef?"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-3 text-slate-700">Category</label>
                <select
                  value={newRecipe.category}
                  onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  <option value="breakfast">🍳 Breakfast</option>
                  <option value="lunch">🥗 Lunch</option>
                  <option value="dinner">🍽️ Dinner</option>
                  <option value="dessert">🧁 Dessert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-3 text-slate-700">Ingredients</label>
                <div className="space-y-3">
                  {newRecipe.ingredients.map((ingredient, index) => (
                    <input
                      key={index}
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
                      placeholder={`Ingredient ${index + 1}`}
                      disabled={loading}
                    />
                  ))}
                  <button
                    onClick={addIngredientField}
                    className="w-full p-3 text-green-600 hover:text-green-700 font-bold bg-green-50 hover:bg-green-100 rounded-2xl border-2 border-dashed border-green-300 hover:border-green-400 transition-all duration-200"
                    disabled={loading}
                  >
                    + Add Another Ingredient
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-3 text-slate-700">Cooking Steps</label>
                <div className="space-y-3">
                  {newRecipe.steps.map((step, index) => (
                    <textarea
                      key={index}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
                      placeholder={`Step ${index + 1} - Describe what to do`}
                      rows="3"
                      disabled={loading}
                    />
                  ))}
                  <button
                    onClick={addStepField}
                    className="w-full p-3 text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-200"
                    disabled={loading}
                  >
                    + Add Another Step
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddRecipe}
                disabled={loading || !newRecipe.name || !newRecipe.author}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Create Recipe
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={loading}
                className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-bold disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeWebsite;