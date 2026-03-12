// Import required packages
import { Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class AppService {
  // Corresponding with the POST HTTP request
  handleAndPostLongLink(link: string): Promise<Response> {
    const linkId = new ShortUniqueId({ length: 4 }).rnd();
    return fetch(`https://script.google.com/macros/s/${process.env.ACTIVATION_ID}/exec`, {
      method: 'POST',
      body: JSON.stringify({
        id: linkId,
        link: link
      })
    });
  }
  // Corresponding with the GET HTTP request
  getHyperlinkById(referenceId: string): Promise<Response> {
    return fetch(`https://script.google.com/macros/s/${process.env.ACTIVATION_ID}/exec?id=${referenceId}`);
  }
}