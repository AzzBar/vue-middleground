<template>
  <div class="ui grid">
    <div class="six wide column">
      <div class="ui segment">
        <h2>Enter Two Addresses to find Restaurants in the middle!</h2>
        <div class="field">
          <div class="ui right input large">
            <gmap-autocomplete @place_changed="setPlace1"> </gmap-autocomplete>
          </div>
        </div>

        <div class="field">
          <div class="ui right input large">
            <gmap-autocomplete @place_changed="setPlace2"> </gmap-autocomplete>
          </div>
        </div>

        <div class="field">
          <i class="dot circle link icon" @click="addMarker"
            >Search for Restaurants</i
          >
        </div>
      </div>
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
    addMarker() {
      this.middleGroundLat =
        (this.address1.geometry.location.lat() +
          this.address2.geometry.location.lat()) /
        2;
      this.middleGroundLng =
        (this.address1.geometry.location.lng() +
          this.address2.geometry.location.lng()) /
        2;
      this.coordinates();
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.middleGroundLat},${this.middleGroundLng}&radius=1000&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;

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
