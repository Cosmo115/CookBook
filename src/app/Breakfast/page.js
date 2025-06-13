'use client'
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Edit, Shuffle, ChefHat, Clock, Users, X } from 'lucide-react';
import { db } from '../firebaseconfig';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

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

  const removeIngredient = (index) => {
    if (newRecipe.ingredients.length > 1) {
      const updated = newRecipe.ingredients.filter((_, i) => i !== index);
      setNewRecipe({ ...newRecipe, ingredients: updated });
    }
  };

  const removeStep = (index) => {
    if (newRecipe.steps.length > 1) {
      const updated = newRecipe.steps.filter((_, i) => i !== index);
      setNewRecipe({ ...newRecipe, steps: updated });
    }
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
    // These gradients are now replaced with a single solid color
    switch(category) {
      case 'breakfast': return 'bg-purple-600';
      case 'lunch': return 'bg-purple-600';
      case 'dinner': return 'bg-purple-600';
      case 'dessert': return 'bg-purple-600';
      default: return 'bg-purple-600';
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-purple-200/50 shadow-xl">
        <div className="flex items-center justify-center py-6 px-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg"> {/* Changed from gradient */}
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recipe Kitchen
              </h1>
              <p className="text-sm text-slate-700 font-medium">Discover & Create Amazing Recipes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white/95 backdrop-blur-xl border-r border-purple-200/50 flex flex-col shadow-2xl mt-24 relative z-30">
        {/* Controls */}
        <div className="p-6 space-y-4">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex items-center justify-between p-4 ${getCategoryGradient(selectedCategory)} text-white rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(selectedCategory)}</span>
                <span className="font-bold text-lg">
                  {selectedCategory === 'all' ? 'All Recipes' :
                    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border border-purple-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {['all', 'breakfast', 'lunch', 'dinner', 'dessert'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {getCategoryIcon(category)}
                    </span>
                    <span className="font-semibold text-slate-800">
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
            className="w-full flex items-center justify-center gap-3 p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg" // Changed from gradient
          >
            <Shuffle className="w-5 h-5" />
            <span className="font-bold text-lg">Surprise Me!</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-100/90 backdrop-blur-sm border border-red-300 text-red-800 text-sm rounded-2xl shadow-sm font-medium">
            {error}
          </div>
        )}

        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
          {loading && recipes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-700 font-semibold">Loading delicious recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4"> {/* Changed from gradient */}
                <span className="text-3xl">🍽️</span>
              </div>
              <p className="text-slate-700 font-semibold">No recipes found</p>
              <p className="text-slate-600 text-sm mt-1 font-medium">Try a different category or add a new recipe!</p>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    selectedRecipe && selectedRecipe.id === recipe.id
                      ? 'bg-purple-200 shadow-xl transform scale-[1.03] border-2 border-purple-400' // Changed from gradient
                      : 'bg-white/80 hover:bg-white/95 hover:shadow-lg hover:transform hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-xl mb-2 group-hover:text-purple-700 transition-colors duration-200">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center"> {/* Changed from gradient */}
                          <span className="text-sm">👨‍🍳</span>
                        </div>
                        <span className="text-sm text-slate-700 font-semibold">by {recipe.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-purple-300 text-purple-900 text-sm font-bold rounded-full"> {/* Changed from gradient */}
                          {recipe.category}
                        </span>
                        <span className="text-sm text-slate-600 font-medium">
                          {recipe.ingredients?.length || 0} ingredients
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Recipe Button */}
        <div className="p-6 border-t border-purple-200/50">
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" // Changed from gradient
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold text-lg">Create New Recipe</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-24">
        {/* Recipe Header */}
        {selectedRecipe && (
          <div className="bg-white/95 backdrop-blur-xl border-b border-purple-200/50 p-8 shadow-lg"> {/* Changed from gradient */}
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-slate-800 mb-4">{selectedRecipe.name}</h1>
              <div className="flex items-center justify-center gap-6 text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center"> {/* Changed from gradient */}
                    <span className="text-lg">👨‍🍳</span>
                  </div>
                  <span className="font-semibold text-lg">Created by {selectedRecipe.author}</span>
                </div>
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <div className="flex items-center gap-3">
                  <span className="px-5 py-3 bg-purple-300 text-purple-900 font-bold rounded-full text-base"> {/* Changed from gradient */}
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
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-purple-200/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg"> {/* Changed from gradient */}
                      <span className="text-2xl">🥄</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Ingredients</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-purple-100 rounded-xl border border-purple-200"> {/* Changed from gradient */}
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"> {/* Changed from gradient */}
                          <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <span className="text-slate-800 font-semibold leading-relaxed text-lg">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-purple-200/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-purple-700 rounded-2xl flex items-center justify-center shadow-lg"> {/* Changed from gradient */}
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Instructions</h3>
                  </div>
                  <div className="space-y-5">
                    {selectedRecipe.steps.map((step, index) => (
                      <div key={index} className="flex gap-4 p-5 bg-purple-100 rounded-xl border border-purple-200"> {/* Changed from gradient */}
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"> {/* Changed from gradient */}
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        <p className="text-slate-800 font-semibold leading-relaxed text-lg">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-40 h-40 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"> {/* Changed from gradient */}
                  <span className="text-8xl">🍳</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Choose a Recipe</h2>
                <p className="text-slate-700 text-xl font-medium">Select a recipe from the sidebar to start cooking!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Recipe Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200/50">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"> {/* Changed from gradient */}
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">Create New Recipe</h2>
              <p className="text-slate-700 text-lg font-medium">Share your culinary masterpiece with the world</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 text-sm rounded-2xl font-medium">
                {error}
              </div>
            )}

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-bold mb-4 text-slate-900">Recipe Name</label>
                  <input
                    type="text"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white transition-all duration-200 font-semibold text-slate-900 text-lg placeholder-slate-500"
                    placeholder="Enter an amazing recipe name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-4 text-slate-900">Chef Name</label>
                  <input
                    type="text"
                    value={newRecipe.author}
                    onChange={(e) => setNewRecipe({ ...newRecipe, author: e.target.value })}
                    className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white transition-all duration-200 font-semibold text-slate-900 text-lg placeholder-slate-500"
                    placeholder="Who's the master chef?"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-4 text-slate-900">Category</label>
                <select
                  value={newRecipe.category}
                  onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                  className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white transition-all duration-200 font-semibold text-slate-900 text-lg"
                  disabled={loading}
                >
                  <option value="breakfast">🍳 Breakfast</option>
                  <option value="lunch">🥗 Lunch</option>
                  <option value="dinner">🍽️ Dinner</option>
                  <option value="dessert">🧁 Dessert</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold mb-4 text-slate-900">Ingredients</label>
                <div className="space-y-4">
                  {newRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1 p-4 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white transition-all duration-200 font-semibold text-slate-900 text-lg placeholder-slate-500"
                        placeholder={`Ingredient ${index + 1}`}
                        disabled={loading}
                      />
                      {newRecipe.ingredients.length > 1 && (
                        <button
                          onClick={() => removeIngredient(index)}
                          className="p-4 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-2xl border-2 border-red-300 hover:border-red-400 transition-all duration-200 flex-shrink-0"
                          disabled={loading}
                          title="Remove ingredient"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addIngredientField}
                    className="w-full p-4 text-purple-800 hover:text-purple-900 font-bold bg-purple-100 hover:bg-purple-200 rounded-2xl border-2 border-dashed border-purple-400 hover:border-purple-500 transition-all duration-200 text-lg"
                    disabled={loading}
                  >
                    + Add Another Ingredient
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-4 text-slate-900">Cooking Steps</label>
                <div className="space-y-4">
                  {newRecipe.steps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <textarea
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        className="flex-1 p-4 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white transition-all duration-200 font-semibold text-slate-900 text-lg placeholder-slate-500"
                        placeholder={`Step ${index + 1} - Describe what to do`}
                        rows="4"
                        disabled={loading}
                      />
                      {newRecipe.steps.length > 1 && (
                        <button
                          onClick={() => removeStep(index)}
                          className="p-4 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-2xl border-2 border-red-300 hover:border-red-400 transition-all duration-200 flex-shrink-0 self-start"
                          disabled={loading}
                          title="Remove step"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addStepField}
                    className="w-full p-4 text-purple-800 hover:text-purple-900 font-bold bg-purple-100 hover:bg-purple-200 rounded-2xl border-2 border-dashed border-purple-400 hover:border-purple-500 transition-all duration-200 text-lg"
                    disabled={loading}
                  >
                    + Add Another Step
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-6 mt-10">
              <button
                onClick={handleAddRecipe}
                disabled={loading || !newRecipe.name || !newRecipe.author}
                className="flex-1 px-8 py-5 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl" // Changed from gradient
              >
                {loading && <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>}
                Create Recipe
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={loading}
                className="px-8 py-5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-bold disabled:opacity-50 text-xl"
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