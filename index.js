#!/usr/bin/env node

const program = require('commander')
const itc = require('app-store-scraper')

program
  .usage('<cmd> [options] \n\n  Refer to https://github.com/facundoolano/app-store-scraper')

program
  .command('app')
  .description('Retrieves the full detail of an application.')
  .option('-i, --id <app-id>', 'the iTunes "trackId" of the app, for example 553834731 for Candy Crush Saga. Either this or the appId should be provided.')
  .option('-a, --app-id <app-id>', 'the iTunes "bundleId" of the app, for example com.midasplayer.apps.candycrushsaga for Candy Crush Saga. Either this or the id should be provided.')
  .option('-c, --country <cc>', ' the two letter country code to get the app details from. Defaults to us. Note this also affects the language of the data.')

  .action(args => {
    const options = (({ id, appId, country }) => ({ id, appId, country }))(args)
    itc.app(options)
      .then(handle_result, handle_error)
  })

program
  .command('list')
  .description('Retrieves a list of applications from one of the collections at iTunes.')
  .option('--collection <COL>', '(optional, defaults to TOP_FREE_IOS): the Google Play collection that will be retrieved. (TOP_MAC, TOP_FREE_MAC, ...).')
  .option('--category <CAT>', '(optional, deafaults to no category): the app category to filter by (BOOKS, BUSINESS, ...).')
  .option('-c, --country <cc>', 'the two letter country code to get the list from. Defaults to us.')
  .option('-n, --num <n>', 'the amount of elements to retrieve. Defaults to 50, maximum allowed is 200.', parseInt)

  .action(args => {
    const options = (({ collection, category, country, num }) => ({ collection, category, country, num }))(args)
    options.collection = itc.collection[options.collection]
    options.category = itc.category[options.category]
    itc.list(options)
      .then(handle_result, handle_error)
  })

program
  .command('search')
  .description('Retrieves a list of apps that results of searching by the given term.')
  .option('-t, --term <term>', 'the term to search by.')
  .option('-d, --device <DEVICE>', 'the device to filter for. Defaults to ALL, available options are ALL, MAC, IPAD.')
  .option('-n, --num <n>', 'the amount of elements to retrieve. Defaults to 50, maximum allowed is 200.', parseInt)
  .option('-c, --country <cc>', 'the two letter country code to get the similar apps from. Defaults to us.')

  .action(args => {
    const options = (({ term, device, num, country }) => ({ term, device, num, country }))(args)
    options.device = itc.device[options.device]
    itc.search(options)
      .then(handle_result, handle_error)
  })

program
  .command('suggest')
  .description('Given a string returns up to 50 suggestions to complete a search query term.')
  .option('-t, --term <term>', 'the term to search by.')

  .action(args => {
    const options = (({ term }) => ({ term }))(args)
    itc.suggest(options)
      .then(handle_result, handle_error)
  })

program
  .command('reviews')
  .description('Retrieves a page of reviews for a specific application.')
  .option('-i, --id <app-id>', 'the iTunes "trackId" of the app, for example 553834731 for Candy Crush Saga. Either this or the appId should be provided.')
  .option('-a, --app-id <app-id>', 'the iTunes "bundleId" of the app, for example com.midasplayer.apps.candycrushsaga for Candy Crush Saga. Either this or the id should be provided.')
  .option('-c, --country <cc>', 'the two letter country code to get the reviews from. Defaults to us.')
  .option('-p, --page <n>', 'the review page number to retrieve. Defaults to 1, maximum allowed is 10.', parseInt)
  .option('-s, --sort <SORT>', 'the review sort order. Defaults to store.sort.RECENT, available options are RECENT and HELPFUL.')

  .action(args => {
    const options = (({ id, appId, country, page, sort }) => ({ id, appId, country, page, sort }))(args)
    options.sort = itc.sort[options.sort]
    itc.reviews(options)
      .then(handle_result, handle_error)
  })

program
  .command('similar')
  .description('Returns the list of "customers also bought" apps shown in the app\'s detail page.')
  .option('-i, --id <app-id>', 'the iTunes "trackId" of the app, for example 553834731 for Candy Crush Saga. Either this or the appId should be provided.')
  .option('-a, --app-id <lang>', 'the iTunes "bundleId" of the app, for example com.midasplayer.apps.candycrushsaga for Candy Crush Saga. Either this or the id should be provided.')
  .option('-c, --country <cc>', 'the two letter country code to get the similar apps from. Defaults to us.')

  .action(args => {
    const options = (({ id, appId, country }) => ({ id, appId, country }))(args)
    itc.similar(options)
      .then(handle_result, handle_error)
  })

function handle_result(res){
  console.log(JSON.stringify(res))
  process.exit(0)
}
function handle_error(err){
  console.error(err)
  process.exit(1)
}

program.parse(process.argv)
