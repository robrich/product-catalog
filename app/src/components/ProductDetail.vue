<template>
  <v-container>
    
    <v-card outlined>
      <v-card-title>
        <h1>{{product.name}}</h1>
      </v-card-title>
      <v-card-text>
        <p>{{product.description}}</p>
        <ul class="feature-list">
          <li v-for="[key, value] of Object.entries(product.properties)" :key="key"
            class="feature">
            {{key}}: {{value}}
          </li>
        </ul>
        <img class="image" src="https://placekitten.com/600/300" :alt="product.name" :title="product.name" />
        <h3>Thanks https://www.catipsum.com/ and https://placekitten.com/</h3>
        <p>
          Find box a little too small and curl up with fur hanging out claw drapes. Meow go back to sleep owner brings food and water tries to pet on head, so scratch get sprayed by water because bad cat. Kick up litter when owners are asleep, cry for no apparent reason, so purr when give birth scoot butt on the rug for meeeeouw when in doubt, wash present belly, scratch hand when stroked. Poop on grasses run up and down stairs immediately regret falling into bathtub kitty poochy. This is the day this is the day lick the other cats but attack like a vicious monster. You call this cat food scream at teh bath. Cats go for world domination always ensure to lay down in such a manner that tail can lightly brush human's nose and pretend you want to go out but then don't or crusty butthole. Mice pee in the shoe for the fat cat sat on the mat bat away with paws be superior stretch. Hack. Lick sellotape. Eat the fat cats food my cat stared at me he was sipping his tea, too cats go for world domination so gnaw the corn cob. Eat a rug and furry furry hairs everywhere oh no human coming lie on counter don't get off counter cat milk copy park pee walk owner escape bored tired cage droppings sick vet vomit or thug cat bathe private parts with tongue then lick owner's face yet hiss and stare at nothing then run suddenly away. Poop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script type="ts">
import Vue from 'vue';
import { Product } from '../types/product';

export default Vue.extend({

  props: {
    product: {
      type: Product,
      required: true
    }
  }

});
</script>

<style scoped>
.feature-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.feature {
  margin-right: .5em;
  padding: 0 .5em;
  display: inline-block;
  border-radius: 1.5em;
  background-color: #AA00FF;
  color: white;
  line-height: 1.5em;
  font-size: 0.7em;
  font-weight: bold;
}
.image {
  margin: 20px auto;
  display: block;
}
</style>
