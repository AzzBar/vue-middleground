<template>
  <div>
    <div class="row justify-content-md-center">
        
      
      <div class="col-md-4">
        <h2>Search and add a pin</h2>
      <label>
        <gmap-autocomplete
          @place_changed="setPlace1">
        </gmap-autocomplete>
        
        <h1 v-if="address1">{{address1.geometry.location.lat()}}</h1>
        <h1 v-if="address1">{{address1.geometry.location.lng()}}</h1>
      </label>
      
      <label>
        <gmap-autocomplete
          @place_changed="setPlace2">
        </gmap-autocomplete>
        
        <h1 v-if="address2">{{address2.geometry.location.lat()}}</h1>
        <h1 v-if="address2">{{address2.geometry.location.lng()}}</h1>
      </label>
      <button @click="addMarker">Search for Restaurants</button>
    </div>
    
    <div class="col-md-8">
    <br>
    <gmap-map
      :center="center"
      :zoom="12"
      style="width:100%;  height: 800px;"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
    </div>
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
      currentPlace: null,
      address1: null,
      address2: null,
      middleGround: null
    };
  },

  mounted() {
    this.geolocate();
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace1(place) {
      this.address1 = place;
    },
    setPlace2(place) {
      this.address2 = place;
    },
    addMarker() {
      if (this.address1) {
        const marker = {
          lat: this.address1.geometry.location.lat(),
          lng: this.address1.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.address1);
        
        
      }
      if (this.address2) {
        const marker = {
          lat: this.address2.geometry.location.lat(),
          lng: this.address2.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.address2);
        
        
      }

    const marker = {
        lat: (this.address1.geometry.location.lat() + this.address2.geometry.location.lat()) / 2,
        lng: (this.address1.geometry.location.lng() + this.address2.geometry.location.lng() ) / 2
    }
    this.markers.push({ position: marker });
    this.center = marker;
      

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