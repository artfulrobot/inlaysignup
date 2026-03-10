# Inlay Signup

Makes a pop-up signup form appear after a bit of time on the page followed by an indication of wanting to leave the page.

The extension is licensed under [AGPL-3.0](LICENSE.txt).

## Requirements

* PHP v8.3
* CiviCRM 6.8+
* Inlay 1.4+

## Brief how-to

It's an [Inlay](https://lab.civicrm.org/extensions/inlay) so once installed go
to Administer » Inlays and create a new pop-up signup form.

## PHP Hooks

You can completely override the processing of the first, last, email data sent
by implementing a listener on `Civi\Inlay\InlaySignup::PROCESS_EVENT` and
modifying the `$event->chain` which contains callbacks.

## Javascript Hooks

On successful submission, an `InlaySignupCompleted` event is dispatched on the `document` node. You may want to `document.addEventListener('InlaySignupCompleted', yourHanderFunction)` to, for example, send analytics if the user has opted-in.

## Changes

- v1.4.1
  - Integration with [Inlay 
    Petition](https://codeberg.org/artfulrobot/inlaypetition) (if you are not using that, it makes no difference.)
    That inlay also includes a (non-pop-up) signup form that works very similarly.
    If Inlay Petition is installed then *this* Inlay will piggy-back its activity
    type to record a "signed petition" activity. The subject is set to the name
    of the inlay plus ` [inlaysignup]` so you know where it came from. This makes it
    easy to view or summarise where your signups come from across both pop-up and
    inlaypetition. It also populates that activity's opt-in field which will say
    whether the person was already in the group or not (often people forget they're
    signed up and do it again).

- v1.4
  - Dispatch a CustomEvent not an Event in Javascript, and include `publicTitle` 
    (and `inlay`) in the `event.details` prop. For analytics
- v1.3
  - Replace the unicode charcter with a plain old X and mark it aria-hidden
  - pass the inlay object to the hookable chain.
- v1.2
