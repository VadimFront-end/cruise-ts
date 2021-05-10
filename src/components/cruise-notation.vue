<template>
  <div id="cruise-notation">
    <div class="avtor">
      <div id="photo"></div>
      <h1><strong>Павел Владиславович Опанасенко</strong></h1>
    </div>
    <br>
    <p>Книга Павла Опанасенко «Круиз. Путевой дневник длинную 25 000 км» — это нечто большее, чем туристический отчет.
      Это литература путешествий в истинном смысле этого слова.</p>
    <br>
    <p>Эта книга о поразительной силе дорожного пространства давать силы для обновления и приобретения «нового Я», более
      близкого к настоящему.</p>
    <br>
    <p>Путь героя книги, — это не просто следование от одного пункта к другому, а путь приобщения к искусству
      путешествия — познанию себя через другого и другое.</p>
  </div>
</template>

<script>

export default {
  name: 'cruise-notation'
}
</script>

<style>
.avtor {
  display: flex;
  align-items: center;
}

#cruise-notation {
  font-size: 1.4rem;
  font-family: Monotype Corsiva;
  max-width: 80%;
  margin: 6% 2% 6% 6%;
}

@media (max-width: 1000px) {
  #cruise-notation {
    font-size: 1.6rem;
    margin: 5%;
  }
}

#photo {
  width: 20vh;
  height: 20vh;
  background-image: url(../assets/images/avtor.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  float: left;
  margin: 0 13px 0 0;
  border-radius: 50%;
  border: 1px solid black;
}
</style>