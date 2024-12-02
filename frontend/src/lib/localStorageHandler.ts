export const LocalStorageHandler = {
    /**
     * Stores a JSON object in localStorage.
     * 
     * @param {string} key - The key under which the JSON object will be stored.
     * @param {Object} value - The JSON object to store.
     */
    save: function (key, value) {
      try {
        const jsonString = JSON.stringify(value);
        localStorage.setItem(key, jsonString);
        console.log(`Data saved under key: ${key}`);
      } catch (error) {
        console.error("Error saving to localStorage", error);
      }
    },
  
    /**
     * Retrieves a JSON object from localStorage.
     * 
     * @param {string} key - The key of the JSON object to retrieve.
     * @returns {Object|null} - The parsed JSON object, or null if the key does not exist.
     */
    load: function (key) {
      try {
        const jsonString = localStorage.getItem(key);
        return jsonString ? JSON.parse(jsonString) : null;
      } catch (error) {
        console.error("Error loading from localStorage", error);
        return null;
      }
    },
  
    /**
     * Removes an item from localStorage.
     * 
     * @param {string} key - The key of the item to remove.
     */
    remove: function (key) {
      try {
        localStorage.removeItem(key);
        console.log(`Data removed from key: ${key}`);
      } catch (error) {
        console.error("Error removing from localStorage", error);
      }
    },
  
    /**
     * Clears all data from localStorage.
     */
    clear: function () {
      try {
        localStorage.clear();
        console.log("All localStorage data cleared.");
      } catch (error) {
        console.error("Error clearing localStorage", error);
      }
    }
  };