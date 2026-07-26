import {appointmentPage} from './documents/appointmentPage'
import {blogPost} from './documents/blogPost'
import {contactPage} from './documents/contactPage'
import {homePage} from './documents/homePage'
import {servicesPage} from './documents/servicesPage'
import {siteSettings} from './documents/siteSettings'
import {blockContent} from './objects/blockContent'

export const schemaTypes = [
  blockContent,
  siteSettings,
  homePage,
  servicesPage,
  appointmentPage,
  contactPage,
  blogPost,
]
