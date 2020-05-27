<template>
  <div class="ui stackable grid">
    <div class="six wide column">
      <form class="ui segment large form">
        <h2>Enter Two Addresses to find Restaurants in the middle!</h2>
        <div class="ui segment">
          <div class="field">
            <div class="ui right input large">
              <gmap-autocomplete
                ref="addy1"
                placeholder="Enter The First Address"
                @place_changed="setPlace1"
              >
              </gmap-autocomplete>
            </div>
          </div>

          <div class="field">
            <div class="ui right input large">
              <gmap-autocomplete
                ref="addy2"
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
          <div class="field">
            <div
              class="ui right animated fade button"
              tabindex="0"
              @click="resetMap"
            >
              <div class="visible content">Search again</div>
              <div class="hidden content">Reset this thang!</div>
            </div>
          </div>
        </div>
      </form>
      <div class="ui segment" style="max-height:500px;overflow:scroll">
        <div class="ui divided items">
          <div class="item" v-for="place in finds" :key="place.id">
            <div class="content">
              <div class="header">{{ place.name }}</div>
              <div class="meta">{{ place.vicinity }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ten wide column segment ui">
      <gmap-map :center="center" :zoom="12" :options="{gestureHandling: 'greedy'}" style="width:100%;  height: 700px;">
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          @click="openWindow(m)"
        />
        <gmap-info-window
          @closeclick="window_open = false"
          :opened="window_open"
          :position="infoWindow"
          :options="{
            pixelOffset: {
              width: 0,
              height: -35
            }
          }"
        >
          <div class="content">
              <div class="header">{{ checkIt.name }}</div>
              <div class="meta">{{ checkIt.vicinity }}</div>
            </div>
        </gmap-info-window>
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
      spots: [],
      places: [],
      finds: [],
      radius: null,
      type: "",
      currentPlace: null,
      addy: "",
      address1: null,
      address2: null,
      middleGroundLat: null,
      middleGroundLng: null,
      info_marker: null,
      infoWindow: { lat: 28, lng: -80 },
      window_open: false,
      checkIt: "heshtfdhf"
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

    addMarker() {
      this.coordinates();
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        this.middleGroundLat
      },${this.middleGroundLng}&type=${this.type}&radius=${this.radius *
        1000}&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;

      this.axios
        .get(URL)
        .then(response => {
          this.finds = response.data.results;
          this.addLocationsToGoogleMaps();
        })
        .catch(error => {
          console.log(error.message);
        });
    },

    openWindow(item) {
      console.log(this);
      this.checkIt = item;
      this.infoWindow = item.position;
      this.window_open = true;
    },

//resets all arrays and input fields to try another entry
    resetMap() {
      this.markers = [];
      this.spots = [];
      this.places = [];
      this.finds = [];
      this.$refs.addy1.$el.value = "";
      this.$refs.addy2.$el.value = "";
    },

    addLocationsToGoogleMaps() {
      this.finds.forEach(place => {
        const marker = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        };
        this.markers.push({ position: marker,
        vicinity: place.vicinity,
        name: place.name
         });
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
