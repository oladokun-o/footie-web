import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'footiedrop-web-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0;
  stars: boolean[] = [];

  ngOnChanges() {
    this.stars = Array(5).fill(false).map((_, i) => i < this.rating);
  }
}
