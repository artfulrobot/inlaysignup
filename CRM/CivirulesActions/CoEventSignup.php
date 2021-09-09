<?php

class CRM_CivirulesActions_CoEventSignup extends CRM_Civirules_Action {
  /**
   * Method to return the url for additional form processing for action
   * and return false if none is needed
   *
   * @param int $ruleActionId
   * @return bool
   * @access public
   */
  public function getExtraDataInputUrl($ruleActionId) {
    return FALSE;
  }

  /**
   * Method processAction to execute the action
   *
   * @param CRM_Civirules_TriggerData_TriggerData $triggerData
   * @access public
   *
   */
  public function processAction(CRM_Civirules_TriggerData_TriggerData $triggerData) {

    $contactID = $triggerData->getContactId();
    if (!$contactID) {
      $message = "Civirules CoEventSignup action - no contactID.";
      \Civi::log()->error($message);
      throw new Exception($message);
    }

    $triggeringParticipant = $triggerData->getEntityData('Participant');

    if (empty($triggeringParticipant['id'])) {
      $message = "Civirules CoEventSignup action has no participant ID.";
      \Civi::log()->error($message);
      throw new Exception($message);
    }
    \Civi::log()->info("Got participant: " . json_encode($triggeringParticipant, JSON_PRETTY_PRINT));

    if (empty($GLOBALS['artfulrobot_hack_event_signup'])) {
      \Civi::log()->info("Nothing to do; they did not sign up. v2");
      return;
    }
    // Load custom data for participant.
    /*
    $participant = \Civi\Api4\Participant::get(FALSE)
      ->addSelect('Participants_newsletter_option.Newsletter', 'contact_id', 'contact.display_name', 'event.title')
      ->addWhere('Participants_newsletter_option.Newsletter', '=', 'Yes')
      ->addWhere('id', '=', $triggeringParticipant['id'])
      ->execute()->first();

    if (!$participant) {
      // Nothing to do; they did not sign up.
      \Civi::log()->info("Nothing to do; they did not sign up.");
      return;
    }
     */

    // OK, add them to the group.
    $contactIDs = [$contactID];
    list($total, $added, $notAdded) = CRM_Contact_BAO_GroupContact::addContactsToGroup($contactIDs, 457 /* Climate Outreach Newsletter */, 'event', $status='Added');
    // Add consent acctivity

    // Record consent activity.
    $result = civicrm_api3('Activity', 'create', [
      'source_contact_id' => $contactID,
      'target_id'         => $contactID,
      'activity_type_id'  => "Consent",
      'subject'           => "Signed up to $groupName, while registering for event",
      // 'Opted in to receive newsletter via event registration'
      'status_id'         => 'Completed',
      //'location'          => $data['origin'],
      'details'           => "<p>Signed up to mailing list(s): Climate Outreach Newsletter.</p>",
    ]);

    // Send welcome email
    $template = civicrm_api3('MessageTemplate', 'get', [
      'id'         => 98, /* welcome */
      'sequential' => 1,
      'return'     => 'id,msg_title',
    ]);
    if ($template['count'] != 1) {
      \Civi::log()->notice("Failed to find email message template 98 - welcome");
      return;
    }
    $template = $template['values'][0];
    $from = civicrm_api3('OptionValue', 'getvalue', [
      'return'          => "label",
      'option_group_id' => "from_email_address",
      'is_default'      => 1,
    ]);

    // Get to email.

    $email = $GLOBALS['artfulrobot_hack_event_signup']['email-Primary'] ?? NULL;
    if (!$email) {
      \Civi::log()->notice("Failed to find email in data");
      return;
    }

    $msgTplSendParams = [
      'id'         => (int) $template['id'],
      'from'       => $from,
      'to_email'   => $email,
      'contact_id' => $contactID,
      'disable_smarty' => 1,
      //'bcc'        => "forums@artfulrobot.uk", // so I can keep an eye.
      //'template_params' => []
    ];

    $mailingInfo = Civi::settings()->get('mailing_backend');
    if ($mailingInfo['outBound_option'] == \CRM_Mailing_Config::OUTBOUND_OPTION_DISABLED) {
      Civi::log()->warning("Mail disabled. Otherwise would send mailing $template[id]");
      $details = "Message NOT sent: mailer backend is disabled - eg. development mode";
      $status = 'Cancelled';
    }
    else {
      $result = civicrm_api3('MessageTemplate', 'send', $msgTplSendParams);
      $details = "<p>Message successfully sent</p>";
      $status = 'Completed';
    }



  }
}


