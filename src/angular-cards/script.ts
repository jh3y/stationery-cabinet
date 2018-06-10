declare var ng: any
declare var faker: any
const AMOUNT = 20
var {
  platformBrowser,
  platformBrowserDynamic,
  core,
} = ng

var {
  BrowserModule,
} = platformBrowser

var {
  Component,
  NgModule,
  Input,
} = core

@Component({
  selector: 'taco',
  template: `
    <h1>🌮</h1>
  `
})
class Taco {}

class AuthorType {
  firstName: string;
  lastName: string;
  avatar: string;
}

class Post {
  author: AuthorType;
  hero: string;
  title: string;
}

const POSTS:Post[] = new Array(AMOUNT).fill('').map((d, i) => ({
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.internet.avatar(),
    },
    title: faker.company.bs(),
    hero: `https://picsum.photos/420/320?image=${i}`,
  }
))

@Component({
  selector: 'Card',
  template: `
    <div
      class='card'
      [attr.data-gone]='pos < 0 && pos !== 0'
      [attr.data-coming]='pos > 0 && pos !== 0'
      [attr.data-pos]='pos'>
      <img class='card__hero' [src]='post.hero'/>
      <div class='card__content-mark'>
        <article class='card__content'>
          <h1 class='card__title'>{{post.title.charAt(0).toUpperCase() + post.title.slice(1)}}</h1>
          <h2 class='card__author'>{{post.author.firstName}} {{post.author.lastName}}</h2>
        </article>
      </div>
      <img class='card__avatar' [src]='post.author.avatar'/>
    </div>
  `
})
class Card {
  @Input() post: Post;
  @Input() pos: number;
  @Input() active: number;
  @Input() index: number;
}

@Component({
  selector: 'app',
  template: `
    <ul class='card-track'>
      <Card *ngFor='let post of posts; let i = index' [post]='post' [index]='i' [active]='active' [pos]='getPos(i)'></Card>
    </ul>
    <div class='card-actions'>
      <button (click)='setActive(active - 1 >= 0 ? active - 1 : amount - 1)'>
        <svg viewBox="0 0 24 24">
          <path fill="#fff" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
      </button>
      <button (click)='setActive(active + 1 > amount - 1 ? 0 : active + 1)'>
        <svg viewBox="0 0 24 24">
          <path fill="#fff" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </button>
    </div>
  `
})
class App {
  active: number = 0;
  posts: Post[] = POSTS;
  amount: number = 20;
  magicNumber: number = 3;
  setActive: Function = (active:number) => this.active = active;
  getPos: Function = (i: number) => {
    const {
      active,
      amount,
      magicNumber,
    } = this
    let pos:number = i - active
    if (active >= amount - magicNumber && i <= magicNumber) {
      pos = i + (amount - active)
    } else if (active <= magicNumber && i >= amount - magicNumber) {
      pos = 0 - (amount - i + active)
    }
    return pos
  }
}

@NgModule({
  imports: [BrowserModule],
  declarations: [App, Taco, Card],
  bootstrap: [App],
})
class AppModule{}

platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)