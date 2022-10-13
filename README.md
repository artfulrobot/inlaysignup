# Inlay Signup

Makes a pop-up signup form appear after a bit of time on the page followed by an indication of wanting to leave the page.

The extension is licensed under [AGPL-3.0](LICENSE.txt).

## Requirements

* PHP v7.4+
* CiviCRM 5.49+

## Brief how-to

It's an [Inlay](https://lab.civicrm.org/extensions/inlay) so once installed go
to Administer » Inlays and create a new pop-up signup form.

## Hooks

You can completely override the processing of the first, last, email data sent
by implementing a listener on `Civi\Inlay\InlaySignup::PROCESS_EVENT` and
modifying the `$event->chain` which contains callbacks.
