<?php

class CRM_CivirulesActions_CoDownloadFollowup extends CRM_Civirules_Action {
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
      $message = "Civirules CoDownloadFollowup action - no contactID.";
      \Civi::log()->error($message);
      throw new Exception($message);
    }
    $triggeringActivity = $triggerData->getEntityData('Activity');

    if (empty($triggeringActivity['id'])) {
      $message = "Civirules CoDownloadFollowup action has no activity ID.";
      \Civi::log()->error($message);
      throw new Exception($message);
    }

    // Load the inlay.
    try {
      $inlayData = \Civi\Api4\Inlay::get(FALSE)
        ->setCheckPermissions(FALSE)
        ->addWhere('class', '=', 'Civi\\Inlay\\CoDownload')
        ->execute()->first();

      if (!$inlayData) {
        $message = "Failed to load inlay";
        throw new Exception($message);
      }
      $inlay = \Civi\Inlay\Type::fromArray($inlayData);
    }
    catch (\Exception $e) {
      \Civi::log()->error($e->getMessage());
      throw $e;
    }

    // check its subject against the inlay map.
    $messageTemplateID = $inlay->sendFollowup($triggeringActivity, $contactID);
    \Civi::log()->info("Got activity: " . json_encode($triggeringActivity, JSON_PRETTY_PRINT));


  }
}

