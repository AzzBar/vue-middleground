<template>
  <div class="ui grid">
    <div class="six wide column">
      <form class="ui segment large form">
        <h2>Enter Two Addresses to find Restaurants in the middle!</h2>
        <div class="ui segment">
          <div class="field">
            <div class="ui right input large">
              <gmap-autocomplete
                placeholder="Enter The First Address"
                @place_changed="setPlace1"
              >
              </gmap-autocomplete>
            </div>
          </div>

          <div class="field">
            <div class="ui right input large">
              <gmap-autocomplete
                placeholder="Enter The Second Address"
                @place_changed="setPlace2"
              >
              </gmap-autocomplete>
            </div>
          </div>
          <div class="field">
            <div class="two fields">
              <div class="field">
                <span>Select type of search</span>
                <select v-model="type">
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              <div class="field">
                <span>Select radius of search from MiddleGround</span>
                <select v-model="radius">
                  <option value="1">1 KM</option>
                  <option value="5">5 KM</option>
                  <option value="10">10 KM</option>
                  <option value="15">15 KM</option>
                  <option value="20">20 KM</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <div
              class="ui right animated fade button"
              tabindex="0"
              @click="addMarker"
            >
              <div class="visible content">Search for Restaurants!</div>
              <div class="hidden content">HERE WE GO!!!!</div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="ten wide column segment ui">
      <gmap-map :center="center" :zoom="12" style="width:100%;  height: 700px;">
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          @click="center = m.position"
        ></gmap-marker>
      </gmap-map>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      radius: null,
      type: "",
      currentPlace: null,
      address1: null,
      address2: null,
      middleGroundLat: null,
      middleGroundLng: null
    };
  },

  mounted() {
    this.geolocate();
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace1(place) {
      this.address1 = place;
      if (this.address1) {
        const marker = {
          lat: this.address1.geometry.location.lat(),
          lng: this.address1.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.address1);
      }
    },
    setPlace2(place) {
      this.address2 = place;
      if (this.address2) {
        const marker = {
          lat: this.address2.geometry.location.lat(),
          lng: this.address2.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.address2);
      }
    },
    computed: {
      coordinates() {
        return `${this.middleGroundLat}, ${this.middleGroundLng}`;
      }
    },

    addMarker() {
      this.coordinates();
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        this.middleGroundLat
      },${this.middleGroundLng}&type=${this.type}&radius=${this.radius *
        1000}&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;

      this.axios
        .get(URL)
        .then(response => {
          this.places = response.data.results;
          this.addLocationsToGoogleMaps();
        })
        .catch(error => {
          console.log(error.message);
        });
    },

    addLocationsToGoogleMaps() {
      this.places.forEach(place => {
        const marker = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        };
        this.markers.push({ position: marker });
        this.places.push(this.place);
      });
    },
    coordinates() {
      this.middleGroundLat =
        (this.address1.geometry.location.lat() +
          this.address2.geometry.location.lat()) /
        2;
      this.middleGroundLng =
        (this.address1.geometry.location.lng() +
          this.address2.geometry.location.lng()) /
        2;
      return `${this.middleGroundLat}, ${this.middleGroundLng}`;
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>
