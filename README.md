# inlaysignup

This is a custom branch for a particular client. You can fork it and hack it to do the will of your own site, but it's only publicly useful as an example.

## Usage

Create an Inlay at the Civi end as usual.

Add the Inlay's `<script>` tag on the pages you need it on the website. **Also**, wherever you want a Download button to appear, add a tag like this:

```
<noscript
  data-inlay-id={ourID, e.g. "aabb112233"}
  data-download-title="Example report Sep 2021"
  data-download-id={e.g. "1234"}
  data-download-warning="&lt;p&gt;&ltstrong&gt;Warning!&lt;/strong&;gt; graphic imagery.&lt;/p&gt;"
>You need javascript enabled to access this</noscript>
```

The actual download must be a publicly accessible URL on your website at `/download/{downloadID}`. In this regard, this Inlay is not suitable for protecting _sensitive_ data, since it's easy for someone to look at how it works and get the download without supplying info.

The download-warning is optional.

The extension is licensed under [AGPL-3.0](LICENSE.txt).

## Configuration

"Follow up" is supported as follows:

- Provide "May we follow up..." wording
- Enter a tuple of the report title (exact match required) and an email template
  to send that email to people downloading that report.
- There's a `(Default)` report with default follow up email - can be blank
  meaning: do not send a followup email. If the report title does not match the
  specified ones, this is what gets used.

## Requirements

- PHP v7.0+
- CiviCRM (_FIXME: Version number_)

## Installation (Web UI)

This extension has not yet been published for installation via the web UI.

## Installation (CLI, Zip)

Sysadmins and developers may download the `.zip` file for this extension and
install it with the command-line tool [cv](https://github.com/civicrm/cv).

```bash
cd <extension-dir>
cv dl inlaysignup@https://github.com/FIXME/inlaysignup/archive/master.zip
```

## Installation (CLI, Git)

Sysadmins and developers may clone the [Git](https://en.wikipedia.org/wiki/Git) repo for this extension and
install it with the command-line tool [cv](https://github.com/civicrm/cv).

```bash
git clone https://github.com/FIXME/inlaysignup.git
cv en inlaysignup
```

## Usage

(_ FIXME: Where would a new user navigate to get started? What changes would they see? _)

## Known Issues

(_ FIXME _)
